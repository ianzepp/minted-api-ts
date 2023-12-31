import _ from 'lodash';
import project from '@root/package.json';

// Classes
import { Kernel } from "@system/kernels/kernel";
import { Router } from '@system/classes/router';
import { Object } from '@system/classes/object';
import { Column } from '@system/classes/column';

// Preload
import { Routers } from '@system/classes/router';
import { ResponseCORS } from '@root/src/system/classes/response-cors';

// Result interface
export interface OpenApiInfo {
    openapi: string,
    info: _.Dictionary<string>,
    paths: _.Dictionary<any>,
    components: _.Dictionary<any>,
}

// Implementation
export class OpenApi {
    constructor(private readonly kernel: Kernel) {}

    describe() {
        let openapi: OpenApiInfo = {
            openapi: '3.0.0',
            info: {
                title: project.name || 'Minted API',
                version: project.version || '0.0.0',
            },

            // API endpoint paths
            paths: {},

            // Components are the objects & columns
            components: {
                schemas: {}
            },
        };

        // Add routers to openapi.paths
        _.each(Routers, router => this.addRouter(openapi, router));

        // Add objects to openapi.components.schemas
        _.each(this.kernel.meta.objects, object => this.addObject(openapi, object));

        // Done. Return a raw Response instance so we don't wrap the result with API-specific formats
        return ResponseCORS.from(200, openapi);
    }

    addRouter(openapi: OpenApiInfo, router: Router) {
        let spec = openapi.paths;
        let path = router.router_path;
        let verb = router.router_verb;

        // Replace common paths
        path = path.replace(/:object/, '{object}');
        path = path.replace(/:record/, '{record}');
        
        // Set path data
        spec[path] = spec[path] || {};

        // Set verb data
        spec[path][verb] = { parameters: []};

        // Process parameters
        if (path.includes('{object}')) {
            spec[path][verb].parameters.push({
                'name': 'object',
                'in': 'path',
                'required': true,
                'description': 'The object name',
                'schema': {
                    'type': 'string',
                    'enum': this.kernel.meta.object_keys,
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
    }

    addObject(openapi: OpenApiInfo, object: Object) {
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

        // Put result into openapi
        openapi.components.schemas[object.system_name] = result;
    }
}
