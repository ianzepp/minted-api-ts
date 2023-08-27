
// Classes
import { Observer } from '../classes/observer';

export default class extends Observer {
    toName() {
        return 'record.knex-select';
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
        let result = await this.system.knex.tx(this.schema.name).limit(1);
        
        // convert to records

        // this.change.push(... select);
    }
}