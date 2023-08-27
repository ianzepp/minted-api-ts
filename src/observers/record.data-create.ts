import chai from 'chai';

// Classes
import { Observer } from '../classes/observer';

export default class extends Observer {
    toName() {
        return 'record.data-create';
    }
    
    onSchema() {
        return 'record';
    }

    onRing() {
        return Observer.RING_KNEX;
    }

    onCreate() {
        return true;
    }

    async run() {

    }
}