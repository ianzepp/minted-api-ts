import _ from 'lodash';

// Classes
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';

// Typedefs
import { ActionRing } from '@typedefs/action';
import { ObjectType } from '@typedefs/object';


export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return ObjectType.Object;
    }

    onRing(): ActionRing {
        return ActionRing.Test;
    }

    onCreate(): boolean {
        return true;
    }

    onUpdate(): boolean {
        return true;
    }

    onUpsert(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        for(let record of signal.change) {
            let object_name = record.data.name;

            signal.expect(object_name, `object_name '${object_name}'`).match(/^[a-z_0-9]+$/i);
            signal.expect(object_name, `object_name '${object_name}'`).not.match(/^[_0-9]/i);
        }
    }
}