import _ from 'lodash';

export default function<T>(result: T[]): T {
    let r = _.head(result);

    if (r === undefined) {
        throw 404;
    }

    return r;
}
