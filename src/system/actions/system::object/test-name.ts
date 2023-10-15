import _ from 'lodash';
import chai from 'chai';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';
import { Record } from '@src/system/classes/record';

// Typedefs
import { ActionRing } from '@system/typedefs/action';
import { ObjectType } from '@system/typedefs/object';

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

    isSeries(): boolean {
        return true;
    }

    async one(signal: Signal, record: Record) {
        record.expect('name').match(/^[a-z_0-9]+$/i);
        record.expect('name').not.match(/^[_0-9]/i);
    }
}