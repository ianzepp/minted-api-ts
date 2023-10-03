import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { ObjectType } from '../typedefs/object';
import { ColumnType } from '../typedefs/column';

// Routers
import Routers from '../loaders/routers';

// Implementation
export default class extends Router {
    async run() {
        let openapi: _.Dictionary<any> = {
            openapi: '3.0.0',
            info: {
                title: 'Minted API',
                version: '0.0.0'
            },

            // API endpoint paths
            paths: {},

            // Components are the objects & columns
            components: {
                schemas: {}
            },
        };

        // Process paths
        for(let router of Routers) {
            _.assign(openapi.paths, router.toOpenAPI());
        }

        // Process components
        for(let object_data of this.kernel.meta.sources.get(ObjectType.Object)) {
            let object_name = object_data.name;
            openapi.components.schemas[object_name] = this.toComponent(object_name);
        }

        // Done
        return openapi;
    }

    onRouterVerb() {
        return Router.Verb.Get;
    }

    onRouterPath() {
        return '/openapi.json';
    }

    //
    // Helpers
    //

    private toComponent(object_name: string) {
        let object = this.kernel.meta.objects.get(object_name);
        let result = { 
            type: 'object', 
            properties: {
                id: { type: 'string', description: 'The UUID identifier for the record' },
                ns: { type: 'string', description: 'The namespace for the record.' },
            },
            required: ['id', 'ns'],
        };

        // Iterate columns
        for(let column_name in object.columns) {
            let column = object.columns[column_name];

            // Add core column properties
            result.properties[column_name] = {
                type: column.type,
                description: null,
            };

            // Is the column required?
            if (column.of('required')) {
                result.required.push(column_name);
            }
        }

        // Done
        return result;
    }
}