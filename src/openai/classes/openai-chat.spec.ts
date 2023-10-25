import _ from 'lodash';
import chai from 'chai';
import vm from 'vm';

// Classes
import { Kernel } from '@kernel/classes/kernel';
import { toJSON } from '@system/classes/helper';
// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";
import { OpenAiChat } from './openai-chat';

let kernel = new Kernel();
let openai: OpenAiChat;

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test.skip('ping', async () => {
    console.info(await OpenAiChat.send(kernel, 'Reply with "pong"'));
});

test.skip('summarize records from the database', async () => {
    let chat = await OpenAiChat.from(kernel, 'default', 'You are an expert in JSON and database architecture');

    chat.send(await kernel.data.selectAny('object'));
    chat.send(await kernel.data.selectAny('column'));
    chat.send('Review the JSON, and send back a short summary.');

    let summary = await chat.sync();
    console.info('summary', summary);
});

test.skip('summarize a local file (package.json)', async () => {
    let chat = await OpenAiChat.from(kernel, 'default', 'You are an expert in Node JS');

    chat.send_file('./package.json');
    chat.send('Review the JSON, and send back a short summary.');

    let summary = await chat.sync();
    console.info('summary', summary);
});

test.skip('summarize the result of an HTTP GET call', async () => {
    let chat = await OpenAiChat.from(kernel, 'default');

    chat.send_http('https://bitcoin.org/en/');
    chat.send('Review the webpage, and send back a short summary.');

    let summary = await chat.sync();
    console.info('summary', summary);
});

test.skip('evaluate code files and add comments', async () => {
    let chat = await OpenAiChat.from(kernel, 'default', 'You are an expert Typescript programmer');

    chat.send_file('./src/classes/signal.ts');
    chat.send_file('./src/classes/action.ts');
    chat.send('Review the code, and then send back a commented version of the Signal class');

    let summary = await chat.sync();
    console.info('summary', summary);
});

// test.skip('evaluate the typedefs for the system', async () => {
//     let typedefs = kernel.meta.objects.map(object => object.toTypedefs());
//     let typedefs_text = typedefs.join('\n');
    
//     let chat = await OpenAiChat.from(kernel, 'default', 'You are an expert Typescript programmer');
//     chat.send(typedefs);
//     chat.send('Review the interfaces and summarize the overall system.');

//     let summary = await chat.sync();
//     console.info('summary', summary);
// });

test.skip('write and execute code', async () => {
    let chat = await OpenAiChat.from(kernel, 'default', 'You are an expert javascript programmer');
    
    chat.send(kernel.data.selectAny('system::user').then(toJSON));
    chat.send('Process the provided data and extract a unique set of user names. Write javascript that will execute inside of a Node VM content.');
    chat.send('Return an array of string values as the result. You have the lodash library available as `_`.')

    console.info('result:', await chat.exec());
});

test.skip('generate fizz buzz program', async () => {
    let manager = await OpenAiChat.from(kernel, 'default', 'You are an expert project manager, skilled in thinking step-by-step through problems and designing tasks to solve the problem.');

    manager.system('The user will present you with a problem/project. Your job is to act as project manager. Think carefully and come up with a set of steps that will help you reach the goal.');
    manager.system('Respond exclusively in raw JSON, in the following data structure: `[{ "role": "task", "content": "<your task or goal here>" }, ...]`');
    manager.system('Always return an array of these tasks, or an empty array if you have no more tasks to pursue.');

    // Define the problem
    manager.send('Create a program in javascript that runs the Fizz Buzz problem. Think step by step.');

    // Get the results
    let chat = await OpenAiChat.from(kernel, 'default', 'You are a software engineer, skilled at executing granular tasks.');

    for(let task of JSON.parse(await manager.sync())) {
        chat.send('Your next task is as follows:');
        chat.send(task.content);

        // Run the sync
        await chat.sync();
    }
});

