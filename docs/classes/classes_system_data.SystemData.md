[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-data](../modules/classes_system_data.md) / SystemData

# Class: SystemData

[classes/system-data](../modules/classes_system_data.md).SystemData

## Implements

- [`SystemService`](../interfaces/classes_system.SystemService.md)

## Table of contents

### Constructors

- [constructor](classes_system_data.SystemData.md#constructor)

### Properties

- [system](classes_system_data.SystemData.md#system)

### Methods

- [cleanup](classes_system_data.SystemData.md#cleanup)
- [createAll](classes_system_data.SystemData.md#createall)
- [createOne](classes_system_data.SystemData.md#createone)
- [deleteAll](classes_system_data.SystemData.md#deleteall)
- [deleteAny](classes_system_data.SystemData.md#deleteany)
- [deleteIds](classes_system_data.SystemData.md#deleteids)
- [deleteOne](classes_system_data.SystemData.md#deleteone)
- [expireAll](classes_system_data.SystemData.md#expireall)
- [expireAny](classes_system_data.SystemData.md#expireany)
- [expireIds](classes_system_data.SystemData.md#expireids)
- [expireOne](classes_system_data.SystemData.md#expireone)
- [run](classes_system_data.SystemData.md#run)
- [select404](classes_system_data.SystemData.md#select404)
- [selectAll](classes_system_data.SystemData.md#selectall)
- [selectAny](classes_system_data.SystemData.md#selectany)
- [selectIds](classes_system_data.SystemData.md#selectids)
- [selectOne](classes_system_data.SystemData.md#selectone)
- [startup](classes_system_data.SystemData.md#startup)
- [updateAll](classes_system_data.SystemData.md#updateall)
- [updateAny](classes_system_data.SystemData.md#updateany)
- [updateIds](classes_system_data.SystemData.md#updateids)
- [updateOne](classes_system_data.SystemData.md#updateone)
- [upsertAll](classes_system_data.SystemData.md#upsertall)
- [upsertOne](classes_system_data.SystemData.md#upsertone)

## Constructors

### constructor

• **new SystemData**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-data.ts:42](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L42)

## Properties

### system

• `Private` `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-data.ts:42](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L42)

## Methods

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[cleanup](../interfaces/classes_system.SystemService.md#cleanup)

#### Defined in

[src/classes/system-data.ts:46](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L46)

___

### createAll

▸ **createAll**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:95](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L95)

___

### createOne

▸ **createOne**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:123](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L123)

___

### deleteAll

▸ **deleteAll**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:111](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L111)

___

### deleteAny

▸ **deleteAny**(`schema_name`, `filter_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:162](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L162)

___

### deleteIds

▸ **deleteIds**(`schema_name`, `record_ids`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `record_ids` | `string`[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:186](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L186)

___

### deleteOne

▸ **deleteOne**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:139](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L139)

___

### expireAll

▸ **expireAll**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:107](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L107)

___

### expireAny

▸ **expireAny**(`schema_name`, `filter_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:158](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L158)

___

### expireIds

▸ **expireIds**(`schema_name`, `record_ids`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `record_ids` | `string`[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:182](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L182)

___

### expireOne

▸ **expireOne**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:135](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L135)

___

### run

▸ **run**(`schema_name`, `change_data`, `filter_data`, `op`): `Promise`<[`Record`](classes_record.Record.md)[]\>

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

[src/classes/system-data.ts:52](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L52)

___

### select404

▸ **select404**(`schema_name`, `record_one`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `record_one` | `string` |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:170](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L170)

___

### selectAll

▸ **selectAll**(`schema_name`, `source_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `source_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:88](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L88)

___

### selectAny

▸ **selectAny**(`schema_name`, `filter_data?`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:147](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L147)

___

### selectIds

▸ **selectIds**(`schema_name`, `record_ids`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `record_ids` | `string`[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:174](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L174)

___

### selectOne

▸ **selectOne**(`schema_name`, `source_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `source_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:119](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L119)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[startup](../interfaces/classes_system.SystemService.md#startup)

#### Defined in

[src/classes/system-data.ts:44](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L44)

___

### updateAll

▸ **updateAll**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:99](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L99)

___

### updateAny

▸ **updateAny**(`schema_name`, `filter_data`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:151](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L151)

___

### updateIds

▸ **updateIds**(`schema_name`, `record_ids`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `record_ids` | `string`[] |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:178](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L178)

___

### updateOne

▸ **updateOne**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:127](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L127)

___

### upsertAll

▸ **upsertAll**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:103](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L103)

___

### upsertOne

▸ **upsertOne**(`schema_name`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:131](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-data.ts#L131)
