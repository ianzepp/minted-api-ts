import _ from 'lodash';
import fs from 'fs';
import path from 'path';

// API
import { RecordJson } from '../classes/record';
import { SchemaJson } from '../classes/schema';
import { ColumnJson } from '../classes/column';

// Function to read in metadata from a file
function readJson(category: string) {
    let directory = __dirname + '/../metadata/' + category;
    let filenames = fs.readdirSync(directory).sort();
    let result = {} as _.Dictionary<any>;

    // Process into a dictionary
    filenames.forEach(filename => {
        let data = fs.readFileSync(directory + '/' + filename, 'utf-8');
        let json = JSON.parse(data);
        let name = filename.substring(0, filename.indexOf('.json')); // remove trailing '.json'
        result[name] = json;
    })

    // Done
    return result;
}

// Preload all metadata
export const MetadataSchemas = readJson('schemas') as _.Dictionary<SchemaJson>;
export const MetadataColumns = readJson('columns') as _.Dictionary<ColumnJson>;
export const MetadataRecords = readJson('records') as _.Dictionary<RecordJson>;

console.debug('Schemas: %j', MetadataSchemas);
console.debug('Columns: %j', MetadataColumns);
console.debug('Records: %j', MetadataRecords);