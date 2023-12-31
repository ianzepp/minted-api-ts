import _ from 'lodash';

export function assertReturn<T = any>(v: T, message: any = 500): T {
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

export function extractEmail(input: string): string | null {
    return (input.match(/<([^>]+)>/) || [])[1] || null;
}

export function toTypeCase(text: string) {
    text = text.replace(/::/g, ' ');
    text = _.toLower(text);
    text = _.startCase(text);
    text = text.replace(/ /g, '');
    return text;
}
