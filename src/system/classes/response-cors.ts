export class ResponseCORS extends Response {
    constructor(body?: ReadableStream<any> | BlobPart | BlobPart[] | FormData | URLSearchParams, options?: ResponseInit) {
        super(body);

        // Always send CORS headers
        this.headers.set('Access-Control-Allow-Origin', '*');
        this.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        this.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        this.headers.set('Access-Control-Allow-Credentials', 'true');
    }
}