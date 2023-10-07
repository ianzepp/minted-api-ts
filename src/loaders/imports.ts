import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw-sync';

const preload_files = klaw(path.join(__dirname, '../imports'), {
    nodir: true,
    traverseAll: true
});

// Build the list of routers
let preloads = _.chain(preload_files)
    // Convert the klaw format into a simple path
    .map(preload_info => preload_info.path)

    // Only include JSON files
    .filter(preload_path => preload_path.endsWith('.json'))

    // Read the JSON
    .map(preload_path => fs.readJsonSync(preload_path))

    // Done
    .value();

// Export the result as the default
export default preloads;