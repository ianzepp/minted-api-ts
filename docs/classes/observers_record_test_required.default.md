[minted-api](../README.md) / [Exports](../modules.md) / [observers/record.test-required](../modules/observers_record_test_required.md) / default

# Class: default

[observers/record.test-required](../modules/observers_record_test_required.md).default

## Hierarchy

- [`Observer`](classes_observer.Observer.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](observers_record_test_required.default.md#constructor)

### Properties

- [Rank](observers_record_test_required.default.md#rank)
- [Ring](observers_record_test_required.default.md#ring)

### Methods

- [isFailable](observers_record_test_required.default.md#isfailable)
- [isRunnable](observers_record_test_required.default.md#isrunnable)
- [onCreate](observers_record_test_required.default.md#oncreate)
- [onDelete](observers_record_test_required.default.md#ondelete)
- [onRank](observers_record_test_required.default.md#onrank)
- [onRing](observers_record_test_required.default.md#onring)
- [onSchema](observers_record_test_required.default.md#onschema)
- [onSelect](observers_record_test_required.default.md#onselect)
- [onUpdate](observers_record_test_required.default.md#onupdate)
- [onUpsert](observers_record_test_required.default.md#onupsert)
- [run](observers_record_test_required.default.md#run)
- [toJSON](observers_record_test_required.default.md#tojson)
- [toName](observers_record_test_required.default.md#toname)

## Constructors

### constructor

• **new default**()

#### Inherited from

[Observer](classes_observer.Observer.md).[constructor](classes_observer.Observer.md#constructor)

#### Defined in

[src/classes/observer.ts:14](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L14)

## Properties

### Rank

▪ `Static` **Rank**: typeof [`ObserverRank`](../enums/layouts_observer.ObserverRank.md) = `ObserverRank`

#### Inherited from

[Observer](classes_observer.Observer.md).[Rank](classes_observer.Observer.md#rank)

#### Defined in

[src/classes/observer.ts:11](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L11)

___

### Ring

▪ `Static` **Ring**: typeof [`ObserverRing`](../enums/layouts_observer.ObserverRing.md) = `ObserverRing`

#### Inherited from

[Observer](classes_observer.Observer.md).[Ring](classes_observer.Observer.md#ring)

#### Defined in

[src/classes/observer.ts:12](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L12)

## Methods

### isFailable

▸ **isFailable**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[isFailable](classes_observer.Observer.md#isfailable)

#### Defined in

[src/classes/observer.ts:74](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L74)

___

### isRunnable

▸ **isRunnable**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[isRunnable](classes_observer.Observer.md#isrunnable)

#### Defined in

[src/classes/observer.ts:70](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L70)

___

### onCreate

▸ **onCreate**(): `boolean`

#### Returns

`boolean`

#### Overrides

[Observer](classes_observer.Observer.md).[onCreate](classes_observer.Observer.md#oncreate)

#### Defined in

[src/observers/record.test-required.ts:25](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/observers/record.test-required.ts#L25)

___

### onDelete

▸ **onDelete**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onDelete](classes_observer.Observer.md#ondelete)

#### Defined in

[src/classes/observer.ts:66](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L66)

___

### onRank

▸ **onRank**(): [`ObserverRank`](../enums/layouts_observer.ObserverRank.md)

#### Returns

[`ObserverRank`](../enums/layouts_observer.ObserverRank.md)

#### Inherited from

[Observer](classes_observer.Observer.md).[onRank](classes_observer.Observer.md#onrank)

#### Defined in

[src/classes/observer.ts:46](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L46)

___

### onRing

▸ **onRing**(): [`ObserverRing`](../enums/layouts_observer.ObserverRing.md)

#### Returns

[`ObserverRing`](../enums/layouts_observer.ObserverRing.md)

#### Overrides

[Observer](classes_observer.Observer.md).[onRing](classes_observer.Observer.md#onring)

#### Defined in

[src/observers/record.test-required.ts:21](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/observers/record.test-required.ts#L21)

___

### onSchema

▸ **onSchema**(): `string`

#### Returns

`string`

#### Overrides

[Observer](classes_observer.Observer.md).[onSchema](classes_observer.Observer.md#onschema)

#### Defined in

[src/observers/record.test-required.ts:17](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/observers/record.test-required.ts#L17)

___

### onSelect

▸ **onSelect**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onSelect](classes_observer.Observer.md#onselect)

#### Defined in

[src/classes/observer.ts:50](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L50)

___

### onUpdate

▸ **onUpdate**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onUpdate](classes_observer.Observer.md#onupdate)

#### Defined in

[src/classes/observer.ts:58](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L58)

___

### onUpsert

▸ **onUpsert**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onUpsert](classes_observer.Observer.md#onupsert)

#### Defined in

[src/classes/observer.ts:62](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L62)

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

[src/observers/record.test-required.ts:29](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/observers/record.test-required.ts#L29)

___

### toJSON

▸ **toJSON**(): `Object`

#### Returns

`Object`

#### Inherited from

[Observer](classes_observer.Observer.md).[toJSON](classes_observer.Observer.md#tojson)

#### Defined in

[src/classes/observer.ts:20](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/observer.ts#L20)

___

### toName

▸ **toName**(): `string`

#### Returns

`string`

#### Overrides

[Observer](classes_observer.Observer.md).[toName](classes_observer.Observer.md#toname)

#### Defined in

[src/observers/record.test-required.ts:13](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/observers/record.test-required.ts#L13)
