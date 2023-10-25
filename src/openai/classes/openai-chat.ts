import _ from 'lodash';
import axios from 'axios';
import Debug from 'debug';
import vm from 'vm';

// Debug
const debug = Debug('minted:openai-chat');

// Classes
import { Kernel } from '@kernel/classes/kernel';
import { Record } from '@system/classes/record';
import { toJSON } from '../../system/classes/helper';

// Interface for the queued completion messages
export interface Completion {
    role: string;
    content: any;
}

export class OpenAiChat {
    private readonly queued: Completion[] = [];
    private config: Record | undefined;
    private record: Record | undefined;

    private constructor(private readonly kernel: Kernel) {}

    // Create a new chat based on a configuration
    public static async from(kernel: Kernel, config_name: string = 'default', instructions?: string) {
        debug('from():', config_name);

        let self = new OpenAiChat(kernel);

        // Setup the chat config
        self.config = await self.kernel.data.lookup404('openai::config', config_name);

        if (self.config.data.content) {
            self.queued.push({ role: 'system', content: self.config.data.content });
        }

        if (instructions) {
            self.queued.push({ role: 'system', content: instructions });
        }

        // Setup the chat record
        self.record = await self.kernel.data.createOne('openai::chat', {
            model: self.config.data.model,
            temperature: self.config.data.temperature
        });

        // Done
        return self;
    }

    // Select an existing chat from a prior chat ID
    public static async fromChatId(kernel: Kernel, record_id: string) {
        debug('fromChatId():', record_id);

        let self = new OpenAiChat(kernel);

        // Setup the chat record
        self.record = await self.kernel.data.select404('openai::config', record_id);

        // Done
        return self;
    }

    public static async send(kernel: Kernel, ... content: string[]) {
        return OpenAiChat.from(kernel)
            .then(ai => ai.send(... content))
            .then(ai => ai.sync());
    }

    //
    // Completion message types
    //

    completion(role: 'system' | 'user', content: string) {
        this.queued.push({ role, content });
        return this;
    }

    system(content: string) {
        this.queued.push({ role: 'system', content })
    }

    send(... content_args: any) {
        content_args.forEach(content => {
            this.queued.push({ role: 'user', content });  
        });

        return this;
    }

    send_file(path: string) {
        return this.send(Bun.file(path).text());
    }

    send_http(path: string, config?: any) {
        return this.send(axios.get(path, config).then(result => result.data));
    }

    //
    // Sync chats and get a response
    //

    async sync() {
        debug('sync():', this.record.data.id);

        // Loop queued messages. If there are any promises, then wait for them to finish
        let completions = [];

        for(let queued of this.queued) {
            if (queued.content instanceof Promise) {
                queued.content = await queued.content;
            }

            // Convert to a completion record
            completions.push({
                chat: this.record.data.id,
                role: queued.role,
                content: queued.content ?? ''
            });
        }

        // Save any queued messages
        await this.kernel.data.createAll('openai::completion', completions);

        // Select all previous completions, for AI context
        let recent_list = await this.kernel.data.searchAny('openai::completion', {
            chat: this.record.data.id, 
        }, {
            created_at: 'asc'
        });

        // If the most recent message is a response from the assistant, then just return that
        let recent = _.last(recent_list);

        if (_.get(recent, 'data.role') === 'assistant') {
            return recent.data.content;
        }

        // Convert to message data
        let recent_data = _.map(recent_list, recent => {
            return { role: recent.data.role, content: recent.data.content }
        });

        // Define the payload for the updated chat messages
        let update = {
            model: this.record.data.model,
            messages: recent_data
        };

        debug('sync(): send', update);

        // Build the chat request and send
        let result_http = await axios.post('https://api.openai.com/v1/chat/completions', update, {
            headers: {
                'Authorization': `Bearer ${ Bun.env.OPENAI_AUTH }`,
                'Content-Type': 'application/json'
            }
        });

        // Extract the completion result
        let result = _.get(_.head(_.get(result_http, 'data.choices')), 'message') as _.Dictionary<any> | undefined;
        
        debug('sync(): recv', result);

        if (result === undefined) {
            return;
        }

        // Save the completion response back into the database
        await this.kernel.data.createOne('openai::completion', {
            chat: this.record.data.id,
            role: result.role,
            content: result.content
        });

        // Return the result content
        return result.content;
    }

    async exec() {
        // Build the vm function
        async function vmFn(code: string) {
            let requireFn = (name: string) => {
                if (name === 'lodash') return _;
                return undefined;
            };

            let sandbox = { 
                require: requireFn,
                console: console,
                searchAny: (object_name: string) => this.kernel.data.searchAny(object_name).then(toJSON),
                search404: (object_name: string, record_id: string) => this.kernel.data.search404(object_name, { id: record_id }).then(toJSON),
            };

            // Wrap the code in a function
            code = `function sandboxFn() {\n${ code }\n}\n\nsandboxFn();`

            console.warn('Executing:');
            console.warn(code);
            console.warn();

            // Create the VM
            vm.createContext(sandbox); // Contextify the sandbox.

            try {
                return vm.runInContext(code, sandbox);
            } 
            
            catch (err) {
                console.error('Failed to execute script.', err);
            }
        }
        
        // Run the sync process to get the generated code
        let result: string = await this.sync();

        // Match the code blocks
        let pattern = /```javascript([\s\S]*?)```/g;
        let matches;

        while ((matches = pattern.exec(result)) !== null) {
            let data = await vmFn(matches[1]);
            console.warn('exec result:', data);
        }
    }
}