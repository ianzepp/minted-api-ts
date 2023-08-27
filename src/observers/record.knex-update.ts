
// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';

export default class extends Observer {
    toName() {
        return 'record.knex-update';
    }
    
    onSchema() {
        return 'record';
    }

    onRing() {
        return Observer.RING_KNEX;
    }

    onUpdate() {
        return true;
    }

    async run() {

        
    }
}