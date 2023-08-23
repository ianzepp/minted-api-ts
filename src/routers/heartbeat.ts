import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return { 
            ping: this.params.ping || undefined,
            pong: new Date().toISOString() 
        };
    }
}