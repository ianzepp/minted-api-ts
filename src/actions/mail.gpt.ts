import _ from 'lodash';
import axios from 'axios';
import * as htmlparser2 from 'htmlparser2';
import { simpleParser } from 'mailparser';
import { marked } from 'marked';

// Classes
import { DataError } from '@kernels/kernel-data';
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@typedefs/action';
import { ObjectType } from '@typedefs/object';
import { extractEmail } from '../classes/helper';

export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return 'mail';
    }

    onRing(): ActionRing {
        return ActionRing.Cascade;
    }

    onCreate(): boolean {
        return true;
    }

    isRunnable(): boolean {
        return typeof Bun.env.SMTP_USER === 'string';
    }

    isParallel(): boolean {
        return true;
    }

    async one(signal: Signal, record: Record): Promise<void> {
        // Process the raw email body into something useful
        let mail = await simpleParser(record.data.body);

        // See if our user is in the email
        let mailTo = _.uniq(_.map(_.compact(_.flattenDeep([
            record.data.head['to'], 
            record.data.head['cc']
        ])), extractEmail));

        // If the email thread does not includes our GPT bot, then skip the email
        if (mailTo.includes(Bun.env.SMTP_USER) === false) {
            return;
        }

        // Convert the body to the text version
        let html = mail.html;
        let text = this.toMessageText(html);

        // Define GPT instructions
        let instructions = `
            # Instructions:

            - Your name is "GPT <gpt@mintedgeek.us>".
            - You are an expert assistant, skilled in reading emails and sending replies. 
            - The content of the email is shown at the bottom of this message.
            - The email may or may not contain HTML formatting.
            - The email may or may not contain prior quoted messages.
            - Some of those quoted messages may be a user question/response, or may be an earlier response from you (as GPT).
            - When you read the email, please read the earlier quoted messages to understand the context.
            - Sometimes, multiple users are asking questions. You should keep track of who is asking what via their email addresses.
            - Try to gain an understanding of each user personality, and respond to that user in their preferred syntax.
            - Try to send simple/short responses for simple questions. 
            - Alternately, if the question is complex but only requires a short response, send the short response.
            - If the response is only one or two lines, you can omit any salutation or closing text.
            - If you need to address multiple users at once, try to extract their name from their email info and use it.
            - When you format your response in markdown, try to only use markdown that can be processed by the nodejs "marked" library.
            - When you end the response, you can simply say "Best." and leave it at that.

            IMPORTANT: If there are users listed in the CC line below, and it looks like the users are talking to each
            other and not asking you directly, then send back your response as a simple "NO_REPLY" keyword. That way the integration
            code knows not to send a response back to the users.

            # Email Header Info:

            - Subject: ${ record.data.head.subject }
            - From: ${ record.data.head.from }
            - CC: ${ record.data.head.cc || [] }
        
            # Email Text:

            ${ text }
        `;

        // Try an alternate format for instructions:


        console.warn(instructions);

        // Query GPT with the email question
        let result_text = await this.queryGPT(instructions);
        // let result_text = "Hi Ian,\n\nSure! I'd be happy to provide you with an overview of how to create a marketing plan for a new tech service using the V2MOM format.\n\nThe V2MOM framework is a strategic planning tool that stands for Vision, Values, Methods, Obstacles, and Measures. It helps you define your goals, align your team, and track progress towards those goals. Here's how you can apply it to create a marketing plan:\n\n1. Vision: Start by defining your vision for the new tech service. What problem does it solve? What is the ultimate goal you want to achieve? Clearly articulate the value proposition and target audience for your service.\n\n2. Values: Identify the core values that will guide your marketing efforts. These could include transparency, innovation, customer-centricity, or any other principles that are important to your brand.\n\n3. Methods: Determine the marketing methods you will use to reach your target audience. This could include a mix of digital marketing channels such as social media advertising, content marketing, search engine optimization, email marketing, and influencer partnerships. Consider the resources and budget available to execute these methods effectively.\n\n4. Obstacles: Identify potential obstacles or challenges that you may encounter during the marketing process. This could include competition, limited budget, regulatory restrictions, or any other factors that may impact your marketing efforts. Develop strategies to overcome these obstacles.\n\n5. Measures: Define the key performance indicators (KPIs) that will help you measure the success of your marketing plan. This could include metrics such as website traffic, conversion rates, customer acquisition cost, customer lifetime value, or brand awareness. Regularly track and analyze these metrics to assess the effectiveness of your marketing efforts.\n\nRemember, a marketing plan is a living document that should be reviewed and adjusted regularly based on market feedback and performance data. Continuously iterate and refine your strategies to optimize results.\n\nI hope this overview helps you in creating your marketing plan for the new tech service. If you have any further questions or need more specific guidance, feel free to ask.\n\nBest regards,\n[Your Name]";
        let result_html = marked(result_text);

        console.warn('result_text', result_text);

        // GPT responds with NO_REPLY?
        if (result_text === 'NO_REPLY') {
            return;
        }

        // Define `replyTo`
        let replyTo = _.uniq(_.compact(_.flattenDeep([
            record.data.head['reply-to'] || record.data.head['from'], 
            record.data.head['cc']
        ])));

        // Define `subject`
        let subject = record.data.head.subject || '';

        if (subject.toUpperCase().startsWith('RE:') === false) {
            subject = 'RE: ' + subject;
        }

        // Define `mail_html`
        let mail_html = `
            <div class="gpt-response">${ result_html }</div>
            <blockquote type="cite">
            ------- Original Message -------<br/>
            ${ mail.from.text } wrote:<br/>                
            ${ mail.html }
            </blockquote><br/>
        `;

        // Done
        let mail_data = {
            from: Bun.env.SMTP_USER,
            to: replyTo,
            subject: subject,
            html: mail_html
        };

        // Insert the outbound SMTP message into the DB for later processing
        await signal.kernel.data.createOne('smtp', {
            name: 'GPT: ' + subject,
            mail: mail_data
        });
    }

    async queryGPT(content: string): Promise<any> {
        let response = await axios.post(Bun.env.OPENAPI_ENDPOINT, {
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": content }],
            temperature: 0.8
        }, { 
            headers: {
                'Authorization': `Bearer ${Bun.env.OPENAPI_KEY}`,
                'Content-Type': 'application/json',
            } 
        });

        // Extract the result
        let choice = _.head(_.get(response, 'data.choices'));
        return _.get(choice, 'message.content');
    }

    toMessageText(html: string) {
        // Response text
        let text = '';

        // Strip content encoding prefixes
        html = html.replace(/^Content-Transfer-Encoding: .+(\n\s*.*)?$/im, '');
        html = html.replace(/^Content-Type: .+(\n\s*.*)?$/im, '');

        // Extracting the text content
        let inQuoteBlock: boolean = false;
        
        let parser = new htmlparser2.Parser({
            onopentag(name: string) {
                if (name === "blockquote") {
                    inQuoteBlock = true;
                    text += "> ";
                }
            },
            ontext(data: string) {
                if (inQuoteBlock) {
                    text += "> " + data.trim() + "\n> ";
                } else {
                    text += data.trim() + "\n";
                }
            },
            onclosetag(tagname: string) {
                if (tagname === "blockquote") {
                    inQuoteBlock = false;
                }
            }
        }, { decodeEntities: true });
        
        parser.write(html);
        parser.end();

        // Done
        return text;
    }
}
