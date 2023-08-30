import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';

// Import base router class definition
import { HttpRouter } from '../classes/http-router';

// Build the list of routers
let preload_base = path.join(__dirname, '../routers');
let preloads = _.chain(fs.readdirSync(preload_base))
    // Ignore anything that ends in `.map`, which happens when the TS is compiled to JS
    .reject(file => file.endsWith('.map'))

    // Load the file
    .map(file => require(path.join(preload_base, file)).default)

    // Instantiate each observer
    .map(type => new type() as HttpRouter)

    // Done, return the _.Dictionary<Observer[]>
    .value();

// Export the result as the default
export default preloads;