
// Classes
import { Observer, ObserverRing } from '../classes/observer';

export default class extends Observer {
    onSchema() {
        return 'record';
    }

    onRing(): ObserverRing {
        return Observer.RING_WORK;
    }

    async run() {
        // Find the record in the database. 
        // For a test, just return fake record
        let record = this.schema.toRecord({
            type: this.schema.name,
            data: {
                id: this.system.toId()
            }
        });

        this.change.length = 0;
        this.change.push(record);
    }
}