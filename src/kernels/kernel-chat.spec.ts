import _ from 'lodash';
import chai from 'chai';

// Classes
import { Kernel } from '@kernels/kernel';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test.skip('connects to Open AI', async () => {
    let chat_id = await kernel.chat.chat('gpt-4');

    // Setup some instructions
    await kernel.chat.system(chat_id, 'You are a coin flipper. Answer exclusively with "heads" or "tails"');

    // Add a completion
    await kernel.chat.user(chat_id, 'Flip a coin, please!');

    // Sync and get the response.
    let recv1: string = await kernel.chat.sync(chat_id);

    console.warn('recv1', recv1);

    if (recv1.match(/tails/i)) {
        // Ask more questions
        await kernel.chat.user(chat_id, 'Sorry to hear. Flip again?');

        // Sync and get the response.
        let recv2 = await kernel.chat.sync(chat_id);

        console.warn('recv2', recv2);
    }

    if (recv1.match(/heads/i)) {
        // Ask more questions
        await kernel.chat.user(chat_id, 'Thats great. Flip again?');

        // Sync and get the response.
        let recv2 = await kernel.chat.sync(chat_id);

        console.warn('recv2', recv2);
    }

});


test.skip('openai chat + personas', async () => {
    // Create a new lawyer
    let persona = await kernel.data.createOne('openai::persona', {
        name: 'risc-os',
        model: 'gpt-4',
        setup: 'You are a RISC CPU. Respond in byte code. Do not exceed 100 instructions.'
    });

    // Start a chat with the person
    let chat_id = await kernel.chat.chat_persona(persona.data.name);

    // Ask to explain the second amendment
    await kernel.chat.user(chat_id, 'Can you explain the second amendment to me?');

    // Listen to the answer
    let answer = await kernel.chat.sync(chat_id);

    console.warn('GPT answer:');
    console.warn('');
    console.warn(answer);
    
});

