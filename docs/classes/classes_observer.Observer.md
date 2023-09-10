[minted-api](../README.md) / [Exports](../modules.md) / [classes/observer](../modules/classes_observer.md) / Observer

# Class: Observer

[classes/observer](../modules/classes_observer.md).Observer

## Hierarchy

- **`Observer`**

  ↳ [`default`](observers_system_column_knex_create_columns.default.md)

  ↳ [`default`](observers_system_column_knex_delete_columns.default.md)

  ↳ [`default`](observers_system_record_knex_create.default.md)

  ↳ [`default`](observers_system_record_knex_delete.default.md)

  ↳ [`default`](observers_system_record_knex_expire.default.md)

  ↳ [`default`](observers_system_record_knex_select.default.md)

  ↳ [`default`](observers_system_record_knex_update.default.md)

  ↳ [`default`](observers_system_record_select_prev.default.md)

  ↳ [`default`](observers_system_record_test_immutable.default.md)

  ↳ [`default`](observers_system_record_test_maximum.default.md)

  ↳ [`default`](observers_system_record_test_minimum.default.md)

  ↳ [`default`](observers_system_record_test_required.default.md)

  ↳ [`default`](observers_system_schema_create_tables.default.md)

  ↳ [`default`](observers_system_schema_delete_tables.default.md)

  ↳ [`default`](observers_system_schema_test_schema_name.default.md)

## Table of contents

### Constructors

- [constructor](classes_observer.Observer.md#constructor)

### Properties

- [Rank](classes_observer.Observer.md#rank)
- [Ring](classes_observer.Observer.md#ring)

### Methods

- [isFailable](classes_observer.Observer.md#isfailable)
- [isRunnable](classes_observer.Observer.md#isrunnable)
- [onCreate](classes_observer.Observer.md#oncreate)
- [onDelete](classes_observer.Observer.md#ondelete)
- [onExpire](classes_observer.Observer.md#onexpire)
- [onRank](classes_observer.Observer.md#onrank)
- [onRing](classes_observer.Observer.md#onring)
- [onSchema](classes_observer.Observer.md#onschema)
- [onSelect](classes_observer.Observer.md#onselect)
- [onUpdate](classes_observer.Observer.md#onupdate)
- [onUpsert](classes_observer.Observer.md#onupsert)
- [run](classes_observer.Observer.md#run)
- [toJSON](classes_observer.Observer.md#tojson)
- [toName](classes_observer.Observer.md#toname)

## Constructors

### constructor

• **new Observer**()

#### Defined in

[src/classes/observer.ts:14](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L14)

## Properties

### Rank

▪ `Static` **Rank**: typeof [`ObserverRank`](../enums/layouts_observer.ObserverRank.md) = `ObserverRank`

#### Defined in

[src/classes/observer.ts:11](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L11)

___

### Ring

▪ `Static` **Ring**: typeof [`ObserverRing`](../enums/layouts_observer.ObserverRing.md) = `ObserverRing`

#### Defined in

[src/classes/observer.ts:12](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L12)

## Methods

### isFailable

▸ **isFailable**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:79](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L79)

___

### isRunnable

▸ **isRunnable**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:75](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L75)

___

### onCreate

▸ **onCreate**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:55](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L55)

___

### onDelete

▸ **onDelete**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:71](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L71)

___

### onExpire

▸ **onExpire**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:67](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L67)

___

### onRank

▸ **onRank**(): [`ObserverRank`](../enums/layouts_observer.ObserverRank.md)

#### Returns

[`ObserverRank`](../enums/layouts_observer.ObserverRank.md)

#### Defined in

[src/classes/observer.ts:47](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L47)

___

### onRing

▸ **onRing**(): [`ObserverRing`](../enums/layouts_observer.ObserverRing.md)

#### Returns

[`ObserverRing`](../enums/layouts_observer.ObserverRing.md)

#### Defined in

[src/classes/observer.ts:43](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L43)

___

### onSchema

▸ **onSchema**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/observer.ts:39](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L39)

___

### onSelect

▸ **onSelect**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:51](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L51)

___

### onUpdate

▸ **onUpdate**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:59](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L59)

___

### onUpsert

▸ **onUpsert**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:63](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L63)

___

### run

▸ **run**(`flow`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `flow` | [`ObserverFlow`](classes_observer_flow.ObserverFlow.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/classes/observer.ts:16](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L16)

___

### toJSON

▸ **toJSON**(): `Object`

#### Returns

`Object`

#### Defined in

[src/classes/observer.ts:20](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L20)

___

### toName

▸ **toName**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/observer.ts:35](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/observer.ts#L35)
