import { Column, ColumnType } from './column';

describe('Column', () => {
    let column: Column;

    beforeEach(() => {
        column = new Column({
            type: 'column',
            data: {
                id: 'test_id',
                ns: 'test_ns',
                sc: 'test_sc',
                schema_name: 'test_schema',
                column_name: 'test_column',
                intern_name: 'test_intern',
                description: 'test_description',
                type: ColumnType.Text,
                required: true,
                indexed: false,
                searchable: true,
                precision: 2,
                min: 1,
                max: 10,
                enums: ['enum1', 'enum2']
            }
        });
    });

    // test('should correctly return id', () => {
    //     expect(column.data.id).toBe('test_id');
    // });

    // test('should correctly return ns', () => {
    //     expect(column.data.ns).toBe('test_ns');
    // });

    // test('should correctly return sc', () => {
    //     expect(column.data.sc).toBe('test_sc');
    // });

    test('should correctly return schema_name', () => {
        expect(column.schema_name).toBe('test_schema');
    });

    test('should correctly return column_name', () => {
        expect(column.column_name).toBe('test_column');
    });

    test('should correctly return intern_name', () => {
        expect(column.intern_name).toBe('test_intern');
    });

    test('should correctly return description', () => {
        expect(column.description).toBe('test_description');
    });

    test('should correctly return type', () => {
        expect(column.type).toBe(ColumnType.Text);
    });

    test('should correctly return required', () => {
        expect(column.required).toBe(true);
    });

    test('should correctly return indexed', () => {
        expect(column.indexed).toBe(false);
    });

    test('should correctly return searchable', () => {
        expect(column.searchable).toBe(true);
    });

    test('should correctly return precision', () => {
        expect(column.precision).toBe(2);
    });

    test('should correctly return min', () => {
        expect(column.min).toBe(1);
    });

    test('should correctly return max', () => {
        expect(column.max).toBe(10);
    });

    test('should correctly return enums', () => {
        expect(column.enums).toEqual(['enum1', 'enum2']);
    });

    test('should correctly return full name', () => {
        expect(column.toFullName()).toBe('test_schema.test_column');
    });
});
