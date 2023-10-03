// Servers
import { Server } from '@classes/server';

// Create the http server
Bun.serve({
    port: process.env.PORT || 8080,
    
    fetch(req: Request) {
        return new Server().route(req);
    },
});

