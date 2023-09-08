[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-data](../modules/classes_system_data.md) / SystemData

# Class: SystemData

[classes/system-data](../modules/classes_system_data.md).SystemData

## Table of contents

### Constructors

- [constructor](classes_system_data.SystemData.md#constructor)

### Properties

- [\_\_system](classes_system_data.SystemData.md#__system)

### Methods

- [createAll](classes_system_data.SystemData.md#createall)
- [createOne](classes_system_data.SystemData.md#createone)
- [deleteAll](classes_system_data.SystemData.md#deleteall)
- [deleteAny](classes_system_data.SystemData.md#deleteany)
- [deleteIds](classes_system_data.SystemData.md#deleteids)
- [deleteOne](classes_system_data.SystemData.md#deleteone)
- [onRun](classes_system_data.SystemData.md#onrun)
- [select404](classes_system_data.SystemData.md#select404)
- [selectAny](classes_system_data.SystemData.md#selectany)
- [selectIds](classes_system_data.SystemData.md#selectids)
- [startup](classes_system_data.SystemData.md#startup)
- [updateAll](classes_system_data.SystemData.md#updateall)
- [updateAny](classes_system_data.SystemData.md#updateany)
- [updateOne](classes_system_data.SystemData.md#updateone)
- [upsertAll](classes_system_data.SystemData.md#upsertall)
- [upsertOne](classes_system_data.SystemData.md#upsertone)

## Constructors

### constructor

• **new SystemData**(`__system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-data.ts:22](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L22)

## Properties

### \_\_system

• `Private` `Readonly` **\_\_system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-data.ts:22](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L22)

## Methods

### createAll

▸ **createAll**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:32](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L32)

___

### createOne

▸ **createOne**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:52](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L52)

___

### deleteAll

▸ **deleteAll**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:44](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L44)

___

### deleteAny

▸ **deleteAny**(`schema`, `filter_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:96](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L96)

___

### deleteIds

▸ **deleteIds**(`schema`, `record_ids`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `record_ids` | `string`[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:80](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L80)

___

### deleteOne

▸ **deleteOne**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:64](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L64)

___

### onRun

▸ `Private` **onRun**(`schema_name`, `change_data`, `filter_data`, `op`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |
| `filter_data` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |
| `op` | `string` |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:104](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L104)

___

### select404

▸ **select404**(`schema`, `record_id`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `record_id` | `string` |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:72](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L72)

___

### selectAny

▸ **selectAny**(`schema`, `filter_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:88](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L88)

___

### selectIds

▸ **selectIds**(`schema`, `record_ids`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `record_ids` | `string`[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:76](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L76)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-data.ts:24](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L24)

___

### updateAll

▸ **updateAll**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:36](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L36)

___

### updateAny

▸ **updateAny**(`schema`, `filter_data`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:92](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L92)

___

### updateOne

▸ **updateOne**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:56](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L56)

___

### upsertAll

▸ **upsertAll**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:40](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L40)

___

### upsertOne

▸ **upsertOne**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:60](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-data.ts#L60)
