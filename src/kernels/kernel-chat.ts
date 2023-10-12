import _ from 'lodash';
import axios from 'axios';

// Classes
import { Kernel } from '@kernels/kernel';
import { Record } from '@classes/record';

// Implementation
export class KernelChat {
    constructor(private readonly kernel: Kernel) {}

    async startup() {}
    async cleanup() {}

    async chat_persona(persona_name: string) {
        let persona = await this.kernel.data.search404('openai::persona', { name: persona_name });

        // Create the chat ID
        let chat_id = await this.chat(persona.data.model, persona.data.temperature);

        // Add the system messages using the personas setup info
        await this.completion(chat_id, persona.data.setup, 'system');

        // Done
        return chat_id;
    }

    async chat(model: string = 'gpt-3.5-turbo', temperature: number = 0.7): Promise<string> {
        let parent = await this.kernel.data.createOne('openai::chat', {
            model: model,
            temperature: temperature
        });


        // Done
        return parent.data.id;
    }

    //
    // Completion insert methods
    //

    async system(chat_id: string, content: string) {
        return this.completion(chat_id, content, 'system');
    }

    async user(chat_id: string, content: string) {
        return this.completion(chat_id, content, 'user');
    }

    async completion(chat_id: string, content: string, role: string) {
        return this.kernel.data.createOne('openai::completion', {
            chat: chat_id,
            content: content,
            role: role,
        });
    }
    
    //
    // Sync the whole conversation
    //

    async sync(chat_id: string) {
        // Find the parent chat record
        let parent = await this.kernel.data.select404('openai::chat', chat_id);

        // Find all previous exchanges
        let recent_list = await this.kernel.data.searchAny('openai::completion', {
            chat: chat_id, 
        }, {
            created_at: 'asc'
        });

        // If the most recent message is a response from the assistant, then just return that
        let recent = _.last(recent_list);

        if (_.get(recent, 'data.role') === 'assistant') {
            return recent.data.content;
        }

        // Convert to message data
        let recent_data = _.map(recent_list, recent => this.toData(recent));
        let config = {
            model: parent.data.model ?? null,
            messages: recent_data
        };

        console.warn('kernel-chat:send', config);

        // Build the chat request and send
        let result_http = await axios.post('https://api.openai.com/v1/chat/completions', config, {
            headers: {
                'Authorization': `Bearer ${ Bun.env.OPENAI_AUTH }`,
                'Content-Type': 'application/json'
            }
        });

        // Extract the completion result
        let result = _.get(_.head(_.get(result_http, 'data.choices')), 'message') as _.Dictionary<any> | undefined;
        
        if (result === undefined) {
            return;
        }

        console.warn('kernel-chat:recv', result);

        // Save the completion response back into the database
        await this.kernel.data.createOne('openai::completion', {
            chat: parent.data.id,
            role: result.role,
            content: result.content
        });

        // Return the result content
        return result.content;
    }

    private toData(record: Record) {
        return { role: record.data.role, content: record.data.content };
    }
}
