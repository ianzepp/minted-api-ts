import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw-sync';

import { Neuron } from '@classes/neuron';

const preload_files = klaw(path.join(__dirname, '../neurons'), {
    nodir: true,
    traverseAll: true
});

// Instantiate all of the default neurons, sort by ring priority and then group by schema
let preloads = _.chain(preload_files)
    // Convert the klaw format into a simple path
    .map(preload_info => preload_info.path)

    // Ignore anything that ends in `.map`, which happens when the TS is compiled to JS
    .reject(preload_path => preload_path.endsWith('.map'))

    // Ignore test cases
    .reject(preload_path => preload_path.endsWith('.spec.ts'))
    .reject(preload_path => preload_path.endsWith('.spec.js'))

    // Load the neuron code
    .map(preload_path => require(preload_path).default)

    // Instantiate each neuron
    .map(preload_type => new preload_type() as Neuron)

    // Sort in ascending order by ring priority. Easier to do once here, then every time when executing
    .sortBy(neuron => neuron.onRank())

    // Group the neurons by their runtime ring
    .groupBy(neuron => neuron.onRing())

    // Done, return the _.Dictionary<Neuron[]>
    .value();

export default preloads;