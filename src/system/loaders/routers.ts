import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw-sync';

// Import base router class definition
import { Router } from '@system/classes/router';

const preload_files = klaw(path.join(__dirname, '../routers'), {
    nodir: true,
    traverseAll: true
});

// Build the list of routers
let preloads = _.chain(preload_files)
    // Convert the klaw format into a simple path
    .map(preload_info => preload_info.path)

    // Ignore anything that ends in `.map`, which happens when the TS is compiled to JS
    .reject(preload_path => preload_path.endsWith('.map'))

    // Ignore test cases
    .reject(preload_path => preload_path.endsWith('.spec.ts'))
    .reject(preload_path => preload_path.endsWith('.spec.js'))

    // Load the file
    .map(preload_path => require(preload_path).default)

    // Instantiate each action
    .map(preload_type => new preload_type() as Router)

    // Done
    .value();

// Export the result as the default
export default preloads;