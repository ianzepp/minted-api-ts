import _ from 'lodash';

export default function<T>(v: T, message: any = 500): T {
    if (v === undefined) {
        throw message;
    }

    else {
        return v;
    }
}

