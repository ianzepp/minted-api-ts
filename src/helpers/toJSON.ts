import _ from 'lodash';

export default function<T = any>(something: T): T {
    return JSON.parse(JSON.stringify(something)) as T;
}
