import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';

// Classes
import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { Observer } from '../classes/observer';
import { System } from '../classes/system';

// Create the file list of observers
const OBSERVER_BASE = path.join(__dirname, '../observers');
const OBSERVER_LIST = fs.readdirSync(OBSERVER_BASE);

// Instantiate all of the default observers, sort by ring priority and then group by schema
const OBSERVERS = _.chain(OBSERVER_LIST)
    // Ignore anything that ends in `.map`, which happens when the TS is compiled to JS
    .reject(observerPath => observerPath.endsWith('.map'))

    // Load the observer code
    .map(observerPath => require(path.join(OBSERVER_BASE, observerPath)).default)

    // Instantiate each observer
    .map(observerType => new observerType())

    // Sort in ascending order by ring priority. Easier to do once here, then every time when executing
    .sortBy(observer => observer.onRingPriority())

    // Group the observers by their runtime schema
    .groupBy(observer => observer.onSchema())

    // Done, return the _.Dictionary<Observer[]>
    .value();

// Implementation
export type ObserverRing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export class ObserverFlow {
    constructor(
        readonly system: System,
        readonly schema: Schema,
        readonly change: Record[],
        readonly filter: Filter,
        readonly op: string) {}

    async run(ring: ObserverRing) {
        // Get the master list of observers for this execution context
        let observers: Observer[] = []; 
        observers.push(... _.get(OBSERVERS, 'record') || []);
        observers.push(... _.get(OBSERVERS, this.schema.name) || []);

        // Filter in a single loop
        observers = observers.filter(observer => {
            // Wrong ring?
            if (observer.onRing() !== ring) {
                return false;
            }

            // Accept if the operation matches
            if (observer.onSelect() && this.op === 'select') {
                return true;
            }

            if (observer.onCreate() && this.op === 'create') {
                return true;
            }

            if (observer.onUpdate() && this.op === 'update') {
                return true;
            }

            if (observer.onUpsert() && this.op === 'upsert') {
                return true;
            }

            if (observer.onDelete() && this.op === 'delete') {
                return true;
            }

            // No acceptable matches.
            return false;
        });

        for(let observer of observers) {
            console.debug('ObserverFlow: schema=%j op=%j ring=%j ring-priority=%j observer=%j', 
                this.schema.name, 
                this.op, 
                observer.onRing(),
                observer.onRingPriority(),
                observer.toName()
            );

            try {
                await observer.run(this);
            }

            catch (error) {
                if (observer.isFailable()) {
                    console.warn('ObserverFlow, failable error:', error);
                }

                else {
                    throw error;
                }
            }
        }
    }
}