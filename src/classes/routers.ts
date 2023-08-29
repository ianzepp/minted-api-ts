import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';

// Import base router class definition
import { HttpRouter } from './http-router';

// Build the list of routers
let routers_base = path.join(__dirname, '../routers');
let routers = _.chain(fs.readdirSync(routers_base))
    // Ignore anything that ends in `.map`, which happens when the TS is compiled to JS
    .reject(file => file.endsWith('.map'))

    // Load the file
    .map(file => require(path.join(routers_base, file)).default)

    // Instantiate each observer
    .map(type => new type() as HttpRouter)

    // Done, return the _.Dictionary<Observer[]>
    .value();

// Export the result as the default
export default routers;