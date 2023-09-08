[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-knex](../modules/classes_system_knex.md) / SystemKnex

# Class: SystemKnex

[classes/system-knex](../modules/classes_system_knex.md).SystemKnex

## Table of contents

### Constructors

- [constructor](classes_system_knex.SystemKnex.md#constructor)

### Properties

- [\_\_system](classes_system_knex.SystemKnex.md#__system)
- [\_\_transaction](classes_system_knex.SystemKnex.md#__transaction)

### Methods

- [destroy](classes_system_knex.SystemKnex.md#destroy)
- [select](classes_system_knex.SystemKnex.md#select)
- [startup](classes_system_knex.SystemKnex.md#startup)
- [toStatement](classes_system_knex.SystemKnex.md#tostatement)
- [toStatementFilter](classes_system_knex.SystemKnex.md#tostatementfilter)
- [toTx](classes_system_knex.SystemKnex.md#totx)
- [toWhereAll](classes_system_knex.SystemKnex.md#towhereall)
- [toWhereOne](classes_system_knex.SystemKnex.md#towhereone)
- [toWhereOps](classes_system_knex.SystemKnex.md#towhereops)
- [transaction](classes_system_knex.SystemKnex.md#transaction)

## Constructors

### constructor

• **new SystemKnex**(`__system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-knex.ts:16](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L16)

## Properties

### \_\_system

• `Private` `Readonly` **\_\_system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-knex.ts:16](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L16)

___

### \_\_transaction

• `Private` **\_\_transaction**: `Transaction`<`any`, `any`[]\>

#### Defined in

[src/classes/system-knex.ts:14](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L14)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-knex.ts:22](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L22)

___

### select

▸ **select**(`schema_name`, `columns?`): `Promise`<[`RecordData`](../interfaces/layouts_record.RecordData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |
| `columns` | `string`[] |

#### Returns

`Promise`<[`RecordData`](../interfaces/layouts_record.RecordData.md)[]\>

#### Defined in

[src/classes/system-knex.ts:39](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L39)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-knex.ts:18](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L18)

___

### toStatement

▸ **toStatement**(`schema_name`): `QueryBuilder`<`any`, `DeferredKeySelection`<`any`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |

#### Returns

`QueryBuilder`<`any`, `DeferredKeySelection`<`any`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Defined in

[src/classes/system-knex.ts:65](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L65)

___

### toStatementFilter

▸ **toStatementFilter**(`schema_name`, `filter`): `QueryBuilder`<`any`, `DeferredKeySelection`<`any`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |
| `filter` | [`Filter`](classes_filter.Filter.md) |

#### Returns

`QueryBuilder`<`any`, `DeferredKeySelection`<`any`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Defined in

[src/classes/system-knex.ts:83](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L83)

___

### toTx

▸ **toTx**(`schema_name`, `alias?`): `QueryBuilder`<`any`, `DeferredKeySelection`<`any`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |
| `alias?` | `string` |

#### Returns

`QueryBuilder`<`any`, `DeferredKeySelection`<`any`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Defined in

[src/classes/system-knex.ts:47](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L47)

___

### toWhereAll

▸ `Private` **toWhereAll**(`knex`, `clauses`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `knex` | `QueryBuilder`<`any`, `any`\> |
| `clauses` | `Dictionary`<`any`\>[] |

#### Returns

`void`

#### Defined in

[src/classes/system-knex.ts:108](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L108)

___

### toWhereOne

▸ `Private` **toWhereOne**(`knex`, `clause`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `knex` | `QueryBuilder`<`any`, `any`\> |
| `clause` | `Dictionary`<`any`\> |

#### Returns

`void`

#### Defined in

[src/classes/system-knex.ts:112](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L112)

___

### toWhereOps

▸ `Private` **toWhereOps**(`knex`, `name`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `knex` | `QueryBuilder`<`any`, `any`\> |
| `name` | `string` |
| `data` | `any` |

#### Returns

`void`

#### Defined in

[src/classes/system-knex.ts:116](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L116)

___

### transaction

▸ **transaction**(`runFn`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `runFn` | () => `Promise`<`any`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/classes/system-knex.ts:26](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-knex.ts#L26)
