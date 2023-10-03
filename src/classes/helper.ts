import _ from 'lodash';

export function assertReturn<T>(v: T, message: any = 500): T {
    if (v === undefined) {
        throw message;
    }

    else {
        return v;
    }
}
export function toJSON<T = any>(something: T): T {
    return JSON.parse(JSON.stringify(something)) as T;
}

export function toNull(obj: Object, paths: string[]) {
    _.forEach(paths, path => { 
        if (_.has(obj, path)) {
            _.set(obj, path, null)
        }
    });
}
