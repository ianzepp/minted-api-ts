import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export class RouterPing extends HttpRouter {
    async run() {
        return { 
            pong: new Date().toISOString(),
            user: this.system.user
        };
    }
}