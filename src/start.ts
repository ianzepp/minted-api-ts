// Servers
import { Router } from '@system/classes/router';

// Create the http server
Bun.serve({
    port: process.env.PORT || 8080,
    fetch: (req: Request) => Router.route(req)
});

