
// Classes
import { Observer } from '../classes/observer';

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

    onSelect() {
        return true;
    }

    async run() {

        
    }
}