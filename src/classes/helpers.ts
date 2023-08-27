import _ from 'lodash';
import fs from 'fs-extra';

export function headOne<T>(result: T[]): T | undefined {
    return _.head(result);
}

export function head404<T>(result: T[]): T {
    let r = _.head(result);

    if (r === undefined) {
        throw 404;
    }

    return r;
}
