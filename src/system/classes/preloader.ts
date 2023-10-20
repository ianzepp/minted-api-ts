import _ from 'lodash';
import { sync as globSync } from 'glob';

// Define the helper function
export class Preloader {
    public static from<T>(glob: string): T[] {
        // Use glob to get all directories that match the wildcard
        let export_list = globSync(glob, { absolute: true });

        // Build the list of routers
        return _.chain(export_list)
            // Ignore things
            .reject(filename => filename.endsWith('.spec.ts'))

            // Reverse sort
            .orderBy([], ['desc'])

            // Load the file
            .map(filename => require(filename).default)

            // Reject invalid data
            .reject(type => type === undefined || type === null)

            // Instantiate each action
            .map<T>(type => new type())

            // Done
            .value();
    }
}
