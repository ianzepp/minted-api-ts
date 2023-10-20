import _ from 'lodash';
import path from 'path';

// Classes
import { Signal } from '@system/classes/signal';
import { Record } from '@system/classes/record';

// Create debugger
const debug = require('debug')('minted:system:action');

export enum ActionRing {
    Init, // Action startup
    Test, // Validations
    Knex, // Database changes
    Post, // Post-db changes
    Done,
}

export const ActionRingKeys = _.map(Object.keys(ActionRing), _.toLower);

export interface ActionInit {
    elevated: boolean;
    detached: boolean;
    failable: boolean;
    parallel: boolean;
    series: boolean;
}


// Implementation
export class Action {
    private readonly object: string;
    private readonly method: string;
    private readonly ring: string;

    // Protected constructor
    protected constructor(public readonly filename, public readonly option: Partial<ActionInit> = {}) {
        // Normalize path to use forward slashes
        let normalizedPath = path.normalize(filename).replace(/\\/g, '/');

        // Use a regular expression to extract the <path> portion
        let match = normalizedPath.match(/\/src\/.*?\/actions\/(.*)\/(.*)\/(.*)/);

        if (match === null) {
            debug('Action implementation is outside of the expected filename pattern!');
            return;
        }

        // If a match was found, extract the parts
        this.object = _.toLower(match[1]);
        this.ring = _.toLower(match[2]);

        // Assign the filename path (without the extension) to the router_verb variable
        this.method = _.toLower(path.basename(match[3], path.extname(match[3])));

        debug('action:', filename);
        debug('- action_object', this.object);
        debug('- action_method', this.method);
        debug('- action_ring', this.ring);
     }

    toPackageName(): string {
        return this.filename.replace(path.resolve('./src') + '/', '@');
    }

    onDomain(): string {
        return '*';
    }

    onMethod(): string {
        return this.method;
    }

    onObject(): string {
        return this.object;
    }

    onRing(): string | number {
        return this.ring;
    }

    async run(signal: Signal): Promise<any> {
        throw new Error('Action.run() implemention is missing! Did you forget to remove "parallel" or "series" options?');
    }

    async one(signal: Signal, record: Record, index?: number): Promise<any> {
        throw new Error('Action.one() implemention is missing! Did you forget to enable "parallel" or "series" options?');
    }

}
