import _ from 'lodash';
import chai from 'chai';
import vm from 'vm';

// Classes
import { Kernel } from '@kernels/kernel';
import { toJSON } from '@classes/helper';
// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test.skip('ping', async () => {
    console.info(await kernel.chat.send('Reply with "pong"'));
});

test.skip('summarize records from the database', async () => {
    let chat = await kernel.chat.chat('default', 'You are an expert in JSON and database architecture');

    chat.send(await kernel.data.selectAny('object'));
    chat.send(await kernel.data.selectAny('column'));
    chat.send('Review the JSON, and send back a short summary.');

    let summary = await chat.sync();
    console.info('summary', summary);
});

test.skip('summarize a local file (package.json)', async () => {
    let chat = await kernel.chat.chat('default', 'You are an expert in Node JS');

    chat.send_file('./package.json');
    chat.send('Review the JSON, and send back a short summary.');

    let summary = await chat.sync();
    console.info('summary', summary);
});

test.skip('summarize the result of an HTTP GET call', async () => {
    let chat = await kernel.chat.chat('default');

    chat.send_http('https://bitcoin.org/en/');
    chat.send('Review the webpage, and send back a short summary.');

    let summary = await chat.sync();
    console.info('summary', summary);
});

test.skip('evaluate code files and add comments', async () => {
    let chat = await kernel.chat.chat('default', 'You are an expert Typescript programmer');

    chat.send_file('./src/classes/signal.ts');
    chat.send_file('./src/classes/action.ts');
    chat.send('Review the code, and then send back a commented version of the Signal class');

    let summary = await chat.sync();
    console.info('summary', summary);
});

test.skip('write and execute code', async () => {
    // TODO
});

// test('use the "typescript-expert" persona to write code', async () => {
//     // Start a chat with the persona
//     let runner = await kernel.chat.chat('typescript-expert');

//     // Train
//     runner.system(`
//         You have the following database functions available:

//         // Find all records of an object
//         searchAny(object_name: string): Record[];

//         // Find a record of an object by record ID. Throws an error if the record cannot be found.
//         search404(object_name: string, record_id: string): Record;
//     `);

//     // Train
//     runner.system('You should respond with the code only. The entire response should be a code block and nothing else.');
//     runner.system('Only return javascript code suitable for executing in a Node VM sandbox. Do not return typescript.');

//     // What is the goal?
//     runner.user('Please select all records of the "system::user" type, and return the result.');

//     async function vmFn(code: string) {
//         let sandbox = { 
//             console: console,
//             searchAny: (object_name: string) => kernel.data.searchAny(object_name).then(toJSON),
//             search404: (object_name: string, record_id: string) => kernel.data.search404(object_name, { id: record_id }).then(toJSON),
//         };

//         // Wrap the code in a function
//         code = `function sandboxFn() {\n${ code }\n}\n\nsandboxFn();`

//         console.warn('code', code);

//         // Create the VM
//         vm.createContext(sandbox); // Contextify the sandbox.

//         try {
//             return vm.runInContext(code, sandbox);
//         } 
        
//         catch (err) {
//             console.error('Failed to execute script.', err);
//         }
//     }

//     // Run it
//     let result = await runner.sync();
//     // let result = `\`\`\`typescript
//     // let records: Record[];
    
//     // try {
//     //     records = await searchAny("system::user");
//     // } catch (error) {
//     //     console.log("Error while fetching records: ", error);
//     //     throw error;
//     // }
    
//     // return records;
//     // \`\`\``;

//     let result_code = result.substring("```javascript\n".length, result.length - "\n```".length);
//     // let result_code = _.last(result.match(/^```typescript\n([\s\S]+)\n```$/i)) as string || '';

//     console.warn('result', result);
//     console.warn('result_code', result_code);

//     // execute it
//     let output = await vmFn(result_code);

//     console.warn('output:', output);
// });

