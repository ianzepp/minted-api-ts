import { HttpRouter } from '@classes/http-router';

export interface HttpServerRoute {
    verb: string;
    path: string;
    path_regexp: RegExp,
    router_type: typeof HttpRouter;
}

