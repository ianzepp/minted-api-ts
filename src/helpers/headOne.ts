import _ from 'lodash';

export default function<T>(result: T[]): T | undefined {
    return _.head(result);
}
