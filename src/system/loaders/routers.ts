import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw-sync';
import { sync as globSync } from 'glob';

// Import base router class definition
import { Router } from '@system/classes/router';

// Use glob to get all directories that match the wildcard
const directories = globSync('./src/*/routers');

// Use klaw to get all files in each directory
const preload_files = directories.flatMap(directory => klaw(directory, {
    nodir: true,
    traverseAll: true
}));

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