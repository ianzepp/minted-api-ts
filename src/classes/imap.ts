import _ from 'lodash';
import Imap from 'node-imap';
import NodeMailer from 'nodemailer';
import { toJSON } from './helper';
import * as qp from 'quoted-printable';
import * as htmlparser2 from 'htmlparser2';
import axios from 'axios';

// IMAP config
export const ImapConfig = {
    user: Bun.env.IMAP_USER,
    password: Bun.env.IMAP_PASS,
    host: Bun.env.IMAP_HOST,
    port: _.toInteger(Bun.env.IMAP_PORT),
    autotls: true
};

export const SmtpConfig = {
    host: Bun.env.SMTP_HOST,
    port: _.toInteger(Bun.env.SMTP_PORT),
    secure: false,
    requireTLS: true,
    auth: {
        user: Bun.env.SMTP_USER,
        pass: Bun.env.SMTP_PASS,
    }
};

export class EmailGPT {
    public readonly imap = new Imap(ImapConfig);
    public readonly smtp = NodeMailer.createTransport(SmtpConfig);

    async readImapAsync() {
        try {
            // Connect to the IMAP server
            await this.connectAsync();

            // Open the inbox
            const box = await this.openBoxAsync();

            // Read all the messages in the inbox
            const messages = await this.readMessageBodies(box);

            // Loop and handle
            for (let message of messages) {
                await this.handle(message);
            }

            // Close the connection
            this.imap.end();
        } catch (error) {
            console.trace(error.stack || error);
        }
    }

    private connectAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.imap.once('ready', resolve);
            this.imap.once('error', reject);
            this.imap.connect();
        });
    }

    private openBoxAsync(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.imap.openBox('INBOX', true, (err, box) => {
                if (err) reject(err);
                else resolve(box);
            });
        });
    }

    private readMessageBodies(box: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const fetch = this.imap.seq.fetch('1:*', { bodies: [''], struct: true });
    
            let messages = [];

            fetch.on('message', (msg, seqno) => {
                console.log('Message #%d', seqno)
                var prefix = '(#' + seqno + ') ';
    
                // Placeholders
                var message = {
                    attributes: {},
                    header: {},
                    data: '',
                    text: '',
                };
                
                msg.on('body', (stream, info) => {
                    stream.on('data', (chunk) => {
                        message.data += chunk.toString('utf8');
                    });
                });
    
                msg.once('attributes', (attrs) => {
                    message.attributes = attrs;
                });
                
                // Same logic you have, but at the end:
                msg.once('end', () => {
                    // Process the headers
                    message.header = Imap.parseHeader(message.data);
    
                    // Split the attribute parts into something more useful
                    let [parts_info, ... parts] = message.attributes['struct'];
    
                    // Split the body data by the boundary
                    let boundary = parts_info.params.boundary;
                    let bodies = _.tail(message.data.split('--' + boundary));
    
                    // Map the parts and extract their internal data
                    parts = _.map(parts, (part) => part[0]);
    
                    // Map the parts to the matching bodies
                    parts = _.map(parts, (part, i) => _.set(part, 'body', bodies[i]));
    
                    // Find the body data that is the main text
                    let part = _.find(parts, part => part.type === 'text');
                    let body = part.body;
    
                    if (part.encoding === 'quoted-printable') {
                        console.warn('decoding quoted-printable..')
                        body = qp.decode(body);
                    }
    
                    // Strip content encoding prefixes
                    body = body.replace(/^Content-Transfer-Encoding: .+(\n\s*.*)?$/im, '');
                    body = body.replace(/^Content-Type: .+(\n\s*.*)?$/im, '');
    
                    // Extracting the text content
                    let inQuoteBlock: boolean = false;
                    
                    let parser = new htmlparser2.Parser({
                        onopentag(name: string) {
                            if (name === "blockquote") {
                                inQuoteBlock = true;
                                message.text += "> ";
                            }
                        },
                        ontext(data: string) {
                            if (inQuoteBlock) {
                                message.text += "> " + data.trim() + "\n> ";
                            } else {
                                message.text += data.trim() + "\n";
                            }
                        },
                        onclosetag(tagname: string) {
                            if (tagname === "blockquote") {
                                inQuoteBlock = false;
                            }
                        }
                    }, { decodeEntities: true });
                    
                    parser.write(body);
                    parser.end();

                    // Add to the message array
                    messages.push(message);
                });
            });
    
            fetch.once('error', reject);
            fetch.once('end', () => resolve(messages));
        });
    }

    private async handle(message): Promise<any> {
        console.warn('message', message);

        // Query GPT with the email question
        let response = await this.queryGPT3(message.text);

        console.warn('GPT response:', response);

        // Process for a reply
        let subject = _.head(message.header['subject']) as string || '';

        if (subject.match(/^re:\s/i) === null) {
            subject = 'RE: ' + subject;
        }

        let replyTo = _.compact(_.uniq(_.flattenDeep([
            message.header['reply-to'] || message.header['from'],
            message.header['cc'],
        ])));

        // Prefix the original text with a quote header
        let text = [
            response.message.content,
            '------- Original Message -------',
            `${ message.header['from'] } wrote:`,
            message.text
        ].join('\r\n');
        
        // Send a reply
        let mail = {
            from: Bun.env.IMAP_USER, // Sender address
            to: replyTo, // Receiver, can be an array for multiple recipients
            subject: subject, // Subject line
            text: text,
        };

        await this.sendMail(mail);
    }

    //
    // Smtp
    // 

    sendMail(mail: { from, to, subject, text }) {
        return new Promise((resolve, reject) => {
            console.warn('sending mail', mail);

            this.smtp.sendMail(mail, (error, info) => {
                if (error) reject(error);
                else resolve(info.messageId);
            });
        });
    }

    //
    // GPT
    //

    async queryGPT3(content: string): Promise<any> {
        const headers = {
            'Authorization': `Bearer ${Bun.env.OPENAPI_KEY}`,
            'Content-Type': 'application/json',
        };
    
        const requestBody = {
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": content }],
            temperature: 0.5
        };

        console.warn('OPENAI_ENDPOINT', Bun.env.OPENAPI_ENDPOINT);
        console.warn('headers', headers);
        console.warn('requestBody', requestBody);

        try {
            const response = await axios.post(Bun.env.OPENAPI_ENDPOINT, requestBody, { headers: headers });
            return response.data.choices[0];
        } 
        
        catch (error) {
            console.error('Error querying GPT-3:', error);
            throw error;
        }
    }
}


// Run it
new EmailGPT().readImapAsync();
