import _ from 'lodash';
import { Record } from "../classes/record";

export default function isRecordDict(source: unknown) {
    return typeof source === 'object'; 
}