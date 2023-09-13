import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw-sync';

import { Observer } from '@classes/observer';

const preload_files = klaw(path.join(__dirname, '../observers'), {
    nodir: true,
    traverseAll: true
});

// Instantiate all of the default observers, sort by ring priority and then group by schema
let preloads = _.chain(preload_files)
    // Convert the klaw format into a simple path
    .map(preload_info => preload_info.path)

    // Ignore anything that ends in `.map`, which happens when the TS is compiled to JS
    .reject(preload_path => preload_path.endsWith('.map'))

    // Ignore test cases
    .reject(preload_path => preload_path.endsWith('.spec.ts'))
    .reject(preload_path => preload_path.endsWith('.spec.js'))

    // Load the observer code
    .map(preload_path => require(preload_path).default)

    // Instantiate each observer
    .map(preload_type => new preload_type() as Observer)

    // Sort in ascending order by ring priority. Easier to do once here, then every time when executing
    .sortBy(observer => observer.onRank())

    // Group the observers by their runtime ring
    .groupBy(observer => observer.onRing())

    // Done, return the _.Dictionary<Observer[]>
    .value();

export default preloads;