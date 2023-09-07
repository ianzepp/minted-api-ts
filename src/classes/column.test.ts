import { Schema } from './schema';
import { Column, ColumnType } from './column';

describe('Column', () => {
    let schema: Schema;
    let column: Column;

    beforeEach(() => {
        schema = new Schema({
            id: 'test_id',
            ns: 'test_ns',
            schema_name: 'test_schema',
            metadata: false,
        });

        column = new Column({
            id: 'test_id',
            ns: 'test_ns',
            schema_name: 'test_schema',
            column_name: 'test_column',
            column_type: 'text',
            audited: false,
            immutable: false,
            indexed: false,
            internal: false,
            required: true,
            unique: false,
            minimum: 1,
            maximum: 10,
        }, schema);
    });

    test('should correctly return id', () => {
        expect(column.id).toBe('test_id');
    });

    test('should correctly return ns', () => {
        expect(column.ns).toBe('test_ns');
    });

    test('should correctly return schema_name', () => {
        expect(column.schema_name).toBe('test_schema');
    });

    test('should correctly return column_name', () => {
        expect(column.column_name).toBe('test_column');
    });

    test('should correctly return column_type', () => {
        expect(column.column_type).toBe('text');
    });

    test('should correctly return audited', () => {
        expect(column.audited).toBe(false);
    });

    test('should correctly return immutable', () => {
        expect(column.immutable).toBe(false);
    });

    test('should correctly return indexed', () => {
        expect(column.indexed).toBe(false);
    });

    test('should correctly return internal', () => {
        expect(column.internal).toBe(false);
    });

    test('should correctly return required', () => {
        expect(column.required).toBe(true);
    });

    test('should correctly return unique', () => {
        expect(column.unique).toBe(false);
    });

    test('should correctly return minimum', () => {
        expect(column.minimum).toBe(1);
    });

    test('should correctly return maximum', () => {
        expect(column.maximum).toBe(10);
    });
});
