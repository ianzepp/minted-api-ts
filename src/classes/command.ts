import _ from 'lodash';
import { program, Command } from 'commander';

// Classes
import { System } from '../classes/system';
import { SystemRoot } from '../classes/system-root';

// Layouts
import { SystemUser } from '../layouts/system';

// Data API
async function data_select(system: System, schema_name: string, options: _.Dictionary<any>, cmd: Command) {
    let result = await system.data.selectAny(schema_name, {});
    let result_data = result.map(record => record.data);
    console.table(result_data);
}

async function data_create(system: System, schema_name: string, options: _.Dictionary<any>, cmd: Command) {
    console.warn('data_create', options, cmd);
}

async function data_update(system: System, schema_name: string, options: _.Dictionary<any>, cmd: Command) {
    console.warn('data_update', options, cmd);
}

async function data_delete(system: System, schema_name: string, options: _.Dictionary<any>, cmd: Command) {
    console.warn('data_delete', options, cmd);
}

function runAction(actionFn: Function) {
    return async (... args: any[]) => {
        let system = await new System(new SystemRoot).startup();

        try {
            await actionFn(system, ... args);
        } 
        
        finally {
            process.exit();
        }
    };
}

// Command Program
program
    .command('data:select <schema_name>')
    .action(runAction(data_select));

program
    .command('data:create <schema_name>')
    .action(runAction(data_create));

program
    .command('data:update <schema_name>')
    .action(runAction(data_update));

program
    .command('data:delete <schema_name>')
    .action(runAction(data_delete));

// Done
program.version('0.1.0');
    

// Run it
program.parse(process.argv);

