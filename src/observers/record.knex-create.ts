
// Classes
import { Observer } from '../classes/observer';

export default class extends Observer {
    toName() {
        return 'record.knex-create';
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