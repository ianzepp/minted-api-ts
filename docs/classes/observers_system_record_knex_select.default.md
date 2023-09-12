[minted-api](../README.md) / [Exports](../modules.md) / [observers/system.record/knex-select](../modules/observers_system_record_knex_select.md) / default

# Class: default

[observers/system.record/knex-select](../modules/observers_system_record_knex_select.md).default

## Hierarchy

- [`Observer`](classes_observer.Observer.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](observers_system_record_knex_select.default.md#constructor)

### Properties

- [Rank](observers_system_record_knex_select.default.md#rank)
- [Ring](observers_system_record_knex_select.default.md#ring)

### Methods

- [cleanup](observers_system_record_knex_select.default.md#cleanup)
- [columns](observers_system_record_knex_select.default.md#columns)
- [isFailable](observers_system_record_knex_select.default.md#isfailable)
- [isRunnable](observers_system_record_knex_select.default.md#isrunnable)
- [limit](observers_system_record_knex_select.default.md#limit)
- [onCreate](observers_system_record_knex_select.default.md#oncreate)
- [onDelete](observers_system_record_knex_select.default.md#ondelete)
- [onExpire](observers_system_record_knex_select.default.md#onexpire)
- [onRank](observers_system_record_knex_select.default.md#onrank)
- [onRing](observers_system_record_knex_select.default.md#onring)
- [onSchema](observers_system_record_knex_select.default.md#onschema)
- [onSelect](observers_system_record_knex_select.default.md#onselect)
- [onUpdate](observers_system_record_knex_select.default.md#onupdate)
- [onUpsert](observers_system_record_knex_select.default.md#onupsert)
- [order](observers_system_record_knex_select.default.md#order)
- [run](observers_system_record_knex_select.default.md#run)
- [startup](observers_system_record_knex_select.default.md#startup)
- [toJSON](observers_system_record_knex_select.default.md#tojson)
- [toName](observers_system_record_knex_select.default.md#toname)
- [whereAll](observers_system_record_knex_select.default.md#whereall)
- [whereOne](observers_system_record_knex_select.default.md#whereone)
- [whereOp](observers_system_record_knex_select.default.md#whereop)

## Constructors

### constructor

• **new default**()

#### Inherited from

[Observer](classes_observer.Observer.md).[constructor](classes_observer.Observer.md#constructor)

#### Defined in

[src/classes/observer.ts:14](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L14)

## Properties

### Rank

▪ `Static` **Rank**: typeof [`ObserverRank`](../enums/layouts_observer.ObserverRank.md) = `ObserverRank`

#### Inherited from

[Observer](classes_observer.Observer.md).[Rank](classes_observer.Observer.md#rank)

#### Defined in

[src/classes/observer.ts:11](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L11)

___

### Ring

▪ `Static` **Ring**: typeof [`ObserverRing`](../enums/layouts_observer.ObserverRing.md) = `ObserverRing`

#### Inherited from

[Observer](classes_observer.Observer.md).[Ring](classes_observer.Observer.md#ring)

#### Defined in

[src/classes/observer.ts:12](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L12)

## Methods

### cleanup

▸ **cleanup**(`flow`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `flow` | [`ObserverFlow`](classes_observer_flow.ObserverFlow.md) |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Observer](classes_observer.Observer.md).[cleanup](classes_observer.Observer.md#cleanup)

#### Defined in

[src/classes/observer.ts:18](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L18)

___

### columns

▸ `Private` **columns**(`knex`, `schema`): `QueryBuilder`<`any`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `knex` | `QueryBuilder`<`any`, `any`\> |
| `schema` | [`Schema`](classes_schema.Schema.md) |

#### Returns

`QueryBuilder`<`any`, `any`\>

#### Defined in

[src/observers/system.record/knex-select.ts:242](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L242)

___

### isFailable

▸ **isFailable**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[isFailable](classes_observer.Observer.md#isfailable)

#### Defined in

[src/classes/observer.ts:79](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L79)

___

### isRunnable

▸ **isRunnable**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[isRunnable](classes_observer.Observer.md#isrunnable)

#### Defined in

[src/classes/observer.ts:75](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L75)

___

### limit

▸ `Private` **limit**(`knex`, `limit`): `QueryBuilder`<`any`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `knex` | `QueryBuilder`<`any`, `any`\> |
| `limit` | `number` |

#### Returns

`QueryBuilder`<`any`, `any`\>

#### Defined in

[src/observers/system.record/knex-select.ts:226](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L226)

___

### onCreate

▸ **onCreate**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onCreate](classes_observer.Observer.md#oncreate)

#### Defined in

[src/classes/observer.ts:55](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L55)

___

### onDelete

▸ **onDelete**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onDelete](classes_observer.Observer.md#ondelete)

#### Defined in

[src/classes/observer.ts:71](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L71)

___

### onExpire

▸ **onExpire**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onExpire](classes_observer.Observer.md#onexpire)

#### Defined in

[src/classes/observer.ts:67](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L67)

___

### onRank

▸ **onRank**(): [`ObserverRank`](../enums/layouts_observer.ObserverRank.md)

#### Returns

[`ObserverRank`](../enums/layouts_observer.ObserverRank.md)

#### Inherited from

[Observer](classes_observer.Observer.md).[onRank](classes_observer.Observer.md#onrank)

#### Defined in

[src/classes/observer.ts:47](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L47)

___

### onRing

▸ **onRing**(): [`ObserverRing`](../enums/layouts_observer.ObserverRing.md)

#### Returns

[`ObserverRing`](../enums/layouts_observer.ObserverRing.md)

#### Overrides

[Observer](classes_observer.Observer.md).[onRing](classes_observer.Observer.md#onring)

#### Defined in

[src/observers/system.record/knex-select.ts:23](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L23)

___

### onSchema

▸ **onSchema**(): `string`

#### Returns

`string`

#### Overrides

[Observer](classes_observer.Observer.md).[onSchema](classes_observer.Observer.md#onschema)

#### Defined in

[src/observers/system.record/knex-select.ts:19](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L19)

___

### onSelect

▸ **onSelect**(): `boolean`

#### Returns

`boolean`

#### Overrides

[Observer](classes_observer.Observer.md).[onSelect](classes_observer.Observer.md#onselect)

#### Defined in

[src/observers/system.record/knex-select.ts:27](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L27)

___

### onUpdate

▸ **onUpdate**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onUpdate](classes_observer.Observer.md#onupdate)

#### Defined in

[src/classes/observer.ts:59](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L59)

___

### onUpsert

▸ **onUpsert**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onUpsert](classes_observer.Observer.md#onupsert)

#### Defined in

[src/classes/observer.ts:63](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L63)

___

### order

▸ `Private` **order**(`knex`, `clauses?`): `QueryBuilder`<`any`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `knex` | `QueryBuilder`<`any`, `any`\> |
| `clauses` | `Dictionary`<`any`\> |

#### Returns

`QueryBuilder`<`any`, `any`\>

#### Defined in

[src/observers/system.record/knex-select.ts:213](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L213)

___

### run

▸ **run**(`flow`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `flow` | [`ObserverFlow`](classes_observer_flow.ObserverFlow.md) |

#### Returns

`Promise`<`void`\>

#### Overrides

[Observer](classes_observer.Observer.md).[run](classes_observer.Observer.md#run)

#### Defined in

[src/observers/system.record/knex-select.ts:31](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L31)

___

### startup

▸ **startup**(`flow`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `flow` | [`ObserverFlow`](classes_observer_flow.ObserverFlow.md) |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Observer](classes_observer.Observer.md).[startup](classes_observer.Observer.md#startup)

#### Defined in

[src/classes/observer.ts:16](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L16)

___

### toJSON

▸ **toJSON**(): `Object`

#### Returns

`Object`

#### Inherited from

[Observer](classes_observer.Observer.md).[toJSON](classes_observer.Observer.md#tojson)

#### Defined in

[src/classes/observer.ts:20](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L20)

___

### toName

▸ **toName**(): `string`

#### Returns

`string`

#### Overrides

[Observer](classes_observer.Observer.md).[toName](classes_observer.Observer.md#toname)

#### Defined in

[src/observers/system.record/knex-select.ts:15](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L15)

___

### whereAll

▸ `Private` **whereAll**(`knex`, `conditions?`, `group?`): `QueryBuilder`<`any`, `any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `knex` | `QueryBuilder`<`any`, `any`\> | `undefined` |
| `conditions` | `Dictionary`<`any`\>[] | `[]` |
| `group` | ``"$and"`` \| ``"$or"`` | `'$and'` |

#### Returns

`QueryBuilder`<`any`, `any`\>

#### Defined in

[src/observers/system.record/knex-select.ts:62](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L62)

___

### whereOne

▸ `Private` **whereOne**(`knex`, `clause?`): `QueryBuilder`<`any`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `knex` | `QueryBuilder`<`any`, `any`\> |
| `clause` | `Dictionary`<`any`\> |

#### Returns

`QueryBuilder`<`any`, `any`\>

#### Defined in

[src/observers/system.record/knex-select.ts:89](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L89)

___

### whereOp

▸ `Private` **whereOp**(`knex`, `name`, `data`): `QueryBuilder`<`any`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `knex` | `QueryBuilder`<`any`, `any`\> |
| `name` | `string` |
| `data` | `any` |

#### Returns

`QueryBuilder`<`any`, `any`\>

#### Defined in

[src/observers/system.record/knex-select.ts:101](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.record/knex-select.ts#L101)
