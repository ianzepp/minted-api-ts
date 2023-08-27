
// Classes
import { Observer, ObserverRing } from '../classes/observer';

export default class extends Observer {
    toName() {
        return 'record.data-select';
    }
    
    onSchema() {
        return 'record';
    }

    onRing() {
        return Observer.RING_WORK;
    }

    onSelect() {
        return true;
    }

    async run() {
        // For a test, just return fake record
        let record = this.schema.toRecord({
            type: this.schema.name,
            data: {
                id: this.system.toId(),
                ns: null
            },
            info: {
                created_at: this.system.now(),
                created_by: null,
                updated_at: null,
                updated_by: null,
                deleted_at: null,
                deleted_by: null,
            }
        });

        this.change.length = 0;
        this.change.push(record);
    }
}