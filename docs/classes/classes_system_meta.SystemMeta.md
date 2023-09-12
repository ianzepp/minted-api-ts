[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-meta](../modules/classes_system_meta.md) / SystemMeta

# Class: SystemMeta

[classes/system-meta](../modules/classes_system_meta.md).SystemMeta

## Implements

- [`SystemService`](../interfaces/classes_system.SystemService.md)

## Table of contents

### Constructors

- [constructor](classes_system_meta.SystemMeta.md#constructor)

### Properties

- [columns](classes_system_meta.SystemMeta.md#columns)
- [schemas](classes_system_meta.SystemMeta.md#schemas)
- [sources](classes_system_meta.SystemMeta.md#sources)
- [system](classes_system_meta.SystemMeta.md#system)

### Methods

- [cleanup](classes_system_meta.SystemMeta.md#cleanup)
- [describe](classes_system_meta.SystemMeta.md#describe)
- [find\_column](classes_system_meta.SystemMeta.md#find_column)
- [find\_schema](classes_system_meta.SystemMeta.md#find_schema)
- [find\_source](classes_system_meta.SystemMeta.md#find_source)
- [load](classes_system_meta.SystemMeta.md#load)
- [refresh](classes_system_meta.SystemMeta.md#refresh)
- [startup](classes_system_meta.SystemMeta.md#startup)

## Constructors

### constructor

• **new SystemMeta**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-meta.ts:31](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L31)

## Properties

### columns

• `Readonly` **columns**: [`MapColumns`](classes_system_meta.MapColumns.md)

#### Defined in

[src/classes/system-meta.ts:29](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L29)

___

### schemas

• `Readonly` **schemas**: [`MapSchemas`](classes_system_meta.MapSchemas.md)

#### Defined in

[src/classes/system-meta.ts:28](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L28)

___

### sources

• `Readonly` **sources**: `Map`<`string`, [`RecordFlat`](../interfaces/layouts_record.RecordFlat.md)[]\>

#### Defined in

[src/classes/system-meta.ts:27](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L27)

___

### system

• `Private` `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-meta.ts:31](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L31)

## Methods

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[cleanup](../interfaces/classes_system.SystemService.md#cleanup)

#### Defined in

[src/classes/system-meta.ts:70](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L70)

___

### describe

▸ **describe**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-meta.ts:81](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L81)

___

### find\_column

▸ **find_column**(`schema_name`, `column_name`): [`RecordFlat`](../interfaces/layouts_record.RecordFlat.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |
| `column_name` | `string` |

#### Returns

[`RecordFlat`](../interfaces/layouts_record.RecordFlat.md)

#### Defined in

[src/classes/system-meta.ts:116](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L116)

___

### find\_schema

▸ **find_schema**(`schema_name`): [`RecordFlat`](../interfaces/layouts_record.RecordFlat.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |

#### Returns

[`RecordFlat`](../interfaces/layouts_record.RecordFlat.md)

#### Defined in

[src/classes/system-meta.ts:110](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L110)

___

### find\_source

▸ **find_source**(`schema_path`, `match`, `k?`): [`RecordFlat`](../interfaces/layouts_record.RecordFlat.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `schema_path` | `string` | `undefined` |
| `match` | `string` | `undefined` |
| `k` | `string` | `'name'` |

#### Returns

[`RecordFlat`](../interfaces/layouts_record.RecordFlat.md)

#### Defined in

[src/classes/system-meta.ts:104](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L104)

___

### load

▸ **load**(`schema_path`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_path` | `string` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[src/classes/system-meta.ts:89](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L89)

___

### refresh

▸ **refresh**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-meta.ts:76](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L76)

___

### startup

▸ **startup**(): `Promise`<`void`\>

The `startup` method loads all the core metadata from the DB into a local
service cache. At present, it does the following:

1. Load all `system.schema` records
2. Load all `system.column` records

Once the data is here, we store it in the metadata cache.

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[startup](../interfaces/classes_system.SystemService.md#startup)

#### Defined in

[src/classes/system-meta.ts:46](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L46)
