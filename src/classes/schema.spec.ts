// Classes
import { Schema } from '../classes/schema';
import { SystemAsTest } from './system';


describe('Schema', () => {
    let system = new SystemAsTest();
    let schema: Schema;

    beforeAll(async () => {
        await system.authenticate();
        await system.startup();
    });

    afterAll(async () => {
        await system.cleanup();
    });

    beforeEach(() => {
        schema = new Schema({
            id: 'test_id',
            ns: 'test_ns',
            schema_name: 'test_schema',
            schema_type: 'test_type',
            metadata: false,
        });
    });

    test('should correctly return id', () => {
        expect(schema.id).toBe('test_id');
    });

    test('should correctly return ns', () => {
        expect(schema.ns).toBe('test_ns');
    });

    test('should correctly return schema_name', () => {
        expect(schema.schema_name).toBe('test_schema');
    });

    test('should correctly return schema_type', () => {
        expect(schema.schema_type).toBe('test_type');
    });

    test('should correctly return metadata', () => {
        expect(schema.metadata).toBe(false);
    });
});
