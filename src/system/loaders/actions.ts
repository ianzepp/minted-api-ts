import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw-sync';
import { sync as globSync } from 'glob';
import { Action } from '@system/classes/action';

// Use glob to get all directories that match the wildcard
const directories = globSync('./src/*/actions');

// Use klaw to get all files in each directory
const preload_files = directories.flatMap(directory => klaw(directory, {
    nodir: true,
    traverseAll: true
}));

// Instantiate all of the default actions, sort by ring priority and then group by object
let preloads = _.chain(preload_files)
    // Convert the klaw format into a simple path
    .map(preload_info => preload_info.path)

    // Ignore anything that ends in `.map`, which happens when the TS is compiled to JS
    .reject(preload_path => preload_path.endsWith('.map'))

    // Ignore test cases
    .reject(preload_path => preload_path.endsWith('.spec.ts'))
    .reject(preload_path => preload_path.endsWith('.spec.js'))

    // Load the action code
    .map(preload_path => require(preload_path).default)

    // Instantiate each action
    .map(preload_type => new preload_type() as Action)

    // Sort in ascending order by ring priority. Easier to do once here, then every time when executing
    .sortBy(action => action.onRank())

    // Group the actions by their runtime ring
    .groupBy(action => action.onRing())

    // Done, return the _.Dictionary<action[]>
    .value();

export default preloads;