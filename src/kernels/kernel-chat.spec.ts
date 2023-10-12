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

