// Servers
import { Kernel } from '@system/kernels/kernel';

// Create the http server
Bun.serve({
    port: process.env.PORT || 8080,
    fetch: (req: Request) => new Kernel().route(req)
});

