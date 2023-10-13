import _ from 'lodash';
import axios from 'axios';

// Classes
import { Kernel } from '@system/kernels/kernel';
import { Record } from '@system/classes/record';
import { OpenAiChat } from '@system/classes/openai-chat';

export class KernelChat {
    constructor(private readonly kernel: Kernel) {}

    async startup() {}
    async cleanup() {}

    async chat(config_name?: string, instructions?: string) {
        return OpenAiChat.from(this.kernel, config_name, instructions);
    }

    async send(... content: any) {
        return this.chat()
            .then(ai => ai.send(... content))
            .then(ai => ai.sync());
    }
}
