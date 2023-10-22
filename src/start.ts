import _ from 'lodash';

// Servers
import { Router, Routers } from '@system/classes/router';

// Debug routers
console.info('With routers:');

_.each(_.groupBy(Routers, router => router.router_path), (routers, path) => {
    console.info('-', path, _.map(routers, r => r.router_verb).sort());
});

// Create the http server
Bun.serve({
    hostname: process.env.HOSTNAME || 'localhost',
    port: process.env.PORT || 8080,
    fetch: (req: Request) => Router.route(req)
});

// Done
console.info('Listening:', process.env.HOSTNAME || 'localhost', process.env.PORT || 8080);

