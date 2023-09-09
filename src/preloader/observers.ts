import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';

// Create the file list of observers
let preload_base = path.join(__dirname, '../observers');

// Instantiate all of the default observers, sort by ring priority and then group by schema
let preloads = _.chain(fs.readdirSync(preload_base))
    // Ignore anything that ends in `.map`, which happens when the TS is compiled to JS
    .reject(observerPath => observerPath.endsWith('.map'))

    // Ignore test cases
    .reject(observerPath => observerPath.endsWith('.spec.ts'))
    .reject(observerPath => observerPath.endsWith('.spec.js'))

    // Load the observer code
    .map(observerPath => require(path.join(preload_base, observerPath)).default)

    // Instantiate each observer
    .map(observerType => new observerType())

    // Sort in ascending order by ring priority. Easier to do once here, then every time when executing
    .sortBy(observer => observer.onRank())

    // Group the observers by their runtime schema
    .groupBy(observer => observer.onSchema())

    // Done, return the _.Dictionary<Observer[]>
    .value();

export default preloads;