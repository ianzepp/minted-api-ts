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

• **new SystemData**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-data.ts:29](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L29)

## Properties

### system

• `Private` `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-data.ts:29](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L29)

## Methods

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[cleanup](../interfaces/classes_system.SystemService.md#cleanup)

#### Defined in

[src/classes/system-data.ts:33](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L33)

___

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

[src/classes/system-data.ts:39](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L39)

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

[src/classes/system-data.ts:63](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L63)

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

[src/classes/system-data.ts:55](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L55)

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

[src/classes/system-data.ts:119](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L119)

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

[src/classes/system-data.ts:99](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L99)

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

[src/classes/system-data.ts:79](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L79)

___

### expireAll

▸ **expireAll**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata)[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:51](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L51)

___

### expireAny

▸ **expireAny**(`schema`, `filter_data`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:115](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L115)

___

### expireIds

▸ **expireIds**(`schema`, `record_ids`): `Promise`<[`Record`](classes_record.Record.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `record_ids` | `string`[] |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)[]\>

#### Defined in

[src/classes/system-data.ts:95](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L95)

___

### expireOne

▸ **expireOne**(`schema`, `change_data`): `Promise`<[`Record`](classes_record.Record.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `change_data` | [`ChangeData`](../modules/layouts_record.md#changedata) |

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/system-data.ts:75](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L75)

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

[src/classes/system-data.ts:127](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L127)

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

[src/classes/system-data.ts:87](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L87)

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

[src/classes/system-data.ts:107](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L107)

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

[src/classes/system-data.ts:91](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L91)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[startup](../interfaces/classes_system.SystemService.md#startup)

#### Defined in

[src/classes/system-data.ts:31](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L31)

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

[src/classes/system-data.ts:43](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L43)

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

[src/classes/system-data.ts:111](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L111)

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

[src/classes/system-data.ts:67](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L67)

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

[src/classes/system-data.ts:47](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L47)

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

[src/classes/system-data.ts:71](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-data.ts#L71)
