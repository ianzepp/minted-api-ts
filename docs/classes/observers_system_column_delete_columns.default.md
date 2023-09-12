[minted-api](../README.md) / [Exports](../modules.md) / [observers/system.column/delete-columns](../modules/observers_system_column_delete_columns.md) / default

# Class: default

[observers/system.column/delete-columns](../modules/observers_system_column_delete_columns.md).default

## Hierarchy

- [`Observer`](classes_observer.Observer.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](observers_system_column_delete_columns.default.md#constructor)

### Properties

- [Rank](observers_system_column_delete_columns.default.md#rank)
- [Ring](observers_system_column_delete_columns.default.md#ring)

### Methods

- [cleanup](observers_system_column_delete_columns.default.md#cleanup)
- [isFailable](observers_system_column_delete_columns.default.md#isfailable)
- [isRunnable](observers_system_column_delete_columns.default.md#isrunnable)
- [onCreate](observers_system_column_delete_columns.default.md#oncreate)
- [onDelete](observers_system_column_delete_columns.default.md#ondelete)
- [onExpire](observers_system_column_delete_columns.default.md#onexpire)
- [onRank](observers_system_column_delete_columns.default.md#onrank)
- [onRing](observers_system_column_delete_columns.default.md#onring)
- [onSchema](observers_system_column_delete_columns.default.md#onschema)
- [onSelect](observers_system_column_delete_columns.default.md#onselect)
- [onUpdate](observers_system_column_delete_columns.default.md#onupdate)
- [onUpsert](observers_system_column_delete_columns.default.md#onupsert)
- [one](observers_system_column_delete_columns.default.md#one)
- [run](observers_system_column_delete_columns.default.md#run)
- [startup](observers_system_column_delete_columns.default.md#startup)
- [toJSON](observers_system_column_delete_columns.default.md#tojson)
- [toName](observers_system_column_delete_columns.default.md#toname)

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

#### Overrides

[Observer](classes_observer.Observer.md).[onDelete](classes_observer.Observer.md#ondelete)

#### Defined in

[src/observers/system.column/delete-columns.ts:23](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.column/delete-columns.ts#L23)

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

[src/observers/system.column/delete-columns.ts:19](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.column/delete-columns.ts#L19)

___

### onSchema

▸ **onSchema**(): `string`

#### Returns

`string`

#### Overrides

[Observer](classes_observer.Observer.md).[onSchema](classes_observer.Observer.md#onschema)

#### Defined in

[src/observers/system.column/delete-columns.ts:15](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.column/delete-columns.ts#L15)

___

### onSelect

▸ **onSelect**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Observer](classes_observer.Observer.md).[onSelect](classes_observer.Observer.md#onselect)

#### Defined in

[src/classes/observer.ts:51](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer.ts#L51)

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

### one

▸ **one**(`flow`, `record`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `flow` | [`ObserverFlow`](classes_observer_flow.ObserverFlow.md) |
| `record` | [`Record`](classes_record.Record.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/observers/system.column/delete-columns.ts:31](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.column/delete-columns.ts#L31)

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

[src/observers/system.column/delete-columns.ts:27](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.column/delete-columns.ts#L27)

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

[src/observers/system.column/delete-columns.ts:11](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/observers/system.column/delete-columns.ts#L11)
