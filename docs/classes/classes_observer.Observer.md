[minted-api](../README.md) / [Exports](../modules.md) / [classes/observer](../modules/classes_observer.md) / Observer

# Class: Observer

[classes/observer](../modules/classes_observer.md).Observer

## Hierarchy

- **`Observer`**

  ↳ [`default`](observers_record_knex_create.default.md)

  ↳ [`default`](observers_record_knex_delete.default.md)

  ↳ [`default`](observers_record_knex_expire.default.md)

  ↳ [`default`](observers_record_knex_select.default.md)

  ↳ [`default`](observers_record_knex_update.default.md)

  ↳ [`default`](observers_record_load_prev.default.md)

  ↳ [`default`](observers_record_test_required.default.md)

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

[src/classes/observer.ts:14](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L14)

## Properties

### Rank

▪ `Static` **Rank**: typeof [`ObserverRank`](../enums/layouts_observer.ObserverRank.md) = `ObserverRank`

#### Defined in

[src/classes/observer.ts:11](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L11)

___

### Ring

▪ `Static` **Ring**: typeof [`ObserverRing`](../enums/layouts_observer.ObserverRing.md) = `ObserverRing`

#### Defined in

[src/classes/observer.ts:12](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L12)

## Methods

### isFailable

▸ **isFailable**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:74](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L74)

___

### isRunnable

▸ **isRunnable**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:70](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L70)

___

### onCreate

▸ **onCreate**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:54](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L54)

___

### onDelete

▸ **onDelete**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:66](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L66)

___

### onRank

▸ **onRank**(): [`ObserverRank`](../enums/layouts_observer.ObserverRank.md)

#### Returns

[`ObserverRank`](../enums/layouts_observer.ObserverRank.md)

#### Defined in

[src/classes/observer.ts:46](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L46)

___

### onRing

▸ **onRing**(): [`ObserverRing`](../enums/layouts_observer.ObserverRing.md)

#### Returns

[`ObserverRing`](../enums/layouts_observer.ObserverRing.md)

#### Defined in

[src/classes/observer.ts:42](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L42)

___

### onSchema

▸ **onSchema**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/observer.ts:38](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L38)

___

### onSelect

▸ **onSelect**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:50](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L50)

___

### onUpdate

▸ **onUpdate**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:58](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L58)

___

### onUpsert

▸ **onUpsert**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/observer.ts:62](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L62)

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

[src/classes/observer.ts:16](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L16)

___

### toJSON

▸ **toJSON**(): `Object`

#### Returns

`Object`

#### Defined in

[src/classes/observer.ts:20](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L20)

___

### toName

▸ **toName**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/observer.ts:34](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L34)
