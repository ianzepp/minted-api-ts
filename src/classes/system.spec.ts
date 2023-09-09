import _ from 'lodash';

// Classes
import { SystemAsTest } from '../classes/system';

describe('System', () => {
    // test('new System()', async () => {
    //     let system = new SystemAsTest();
    // });

    // test('system.authenticate()', async () => {
    //     return new SystemAsTest().authenticate();
    // });

    test('system.startup() => system.cleanup()', () => {
        return new SystemAsTest().startup().then(system => system.cleanup());
    });

    // test('system.run()', async () => {
    //     return new SystemAsTest().run(async system => {

    //     });
    // });
});