// Servers
import { HttpServer } from '@classes/http-server';

// Create the http server
Bun.serve({
    port: process.env.PORT || 8080,
    
    fetch(req: Request) {
        return new HttpServer().route(req);
    },
});

