import _ from "lodash";
import { ResponseStatusText } from "./response-status-text";

export class ResponseCORS extends Response {
    constructor(body?: ReadableStream<any> | BlobPart | BlobPart[] | FormData | URLSearchParams, options?: ResponseInit) {
        super(body, options);

        // Always send CORS headers
        this.headers.set('Access-Control-Allow-Origin', '*');
        this.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        this.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        this.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    public static from(status: number, body: any, options: ResponseInit = {}) {
        _.set(options, 'status', status);
        _.set(options, 'statusText', ResponseStatusText[status]);
        return new ResponseCORS(body, options);
    }
}