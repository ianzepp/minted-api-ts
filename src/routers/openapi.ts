import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { Object } from '@classes/object';

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

        // Process components
        for(let [object_name, object] of this.kernel.meta.objects) {
            openapi.components.schemas[object_name] = this.toComponent(object_name, object);
        }

        // Sort the routers so the generated OpenAPI are more presentable
        let routers = _.chain(Routers)
            .sortBy(router => router.onRouterVerb())
            .sortBy(router => router.onRouterPath())
            .value();

        // Process routers into paths
        for(let router of routers) {
            _.assign(openapi.paths, this.toPathSpec(router));
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

    toComponent(object_name: string, object: Object) {
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

    toPathSpec(router: Router) {
        let path = router.onRouterPath();
        let verb = router.onRouterVerb();
        let spec = {};

        // Replace common paths
        path = path.replace(/:object/, '{object}');
        path = path.replace(/:record/, '{record}');

        // Set path data
        spec[path] = {};

        // Set verb data
        spec[path][verb] = { parameters: []};

        // Process parameters
        if (path.includes('{object}')) {
            console.warn('push object', path, verb, );

            spec[path][verb].parameters.push({
                'name': 'object',
                'in': 'path',
                'required': true,
                'description': 'The object name',
                'schema': {
                    'type': 'string',
                    'enum': this.kernel.meta.object_names,
                }
            });
        }

        if (path.includes('{record}')) {
            spec[path][verb].parameters.push({
                'name': 'record',
                'in': 'path',
                'required': true,
                'description': 'The record UUID',
                'schema': {
                    'type': 'string',
                }
            });
        }

        return spec;
    }
}