[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-meta](../modules/classes_system_meta.md) / MapColumns

# Class: MapColumns

[classes/system-meta](../modules/classes_system_meta.md).MapColumns

## Hierarchy

- `Map`<`string`, [`Column`](classes_column.Column.md)\>

  ↳ **`MapColumns`**

## Table of contents

### Constructors

- [constructor](classes_system_meta.MapColumns.md#constructor)

### Properties

- [[toStringTag]](classes_system_meta.MapColumns.md#[tostringtag])
- [size](classes_system_meta.MapColumns.md#size)
- [system](classes_system_meta.MapColumns.md#system)
- [[species]](classes_system_meta.MapColumns.md#[species])

### Methods

- [[iterator]](classes_system_meta.MapColumns.md#[iterator])
- [clear](classes_system_meta.MapColumns.md#clear)
- [delete](classes_system_meta.MapColumns.md#delete)
- [entries](classes_system_meta.MapColumns.md#entries)
- [forEach](classes_system_meta.MapColumns.md#foreach)
- [get](classes_system_meta.MapColumns.md#get)
- [has](classes_system_meta.MapColumns.md#has)
- [keys](classes_system_meta.MapColumns.md#keys)
- [set](classes_system_meta.MapColumns.md#set)
- [values](classes_system_meta.MapColumns.md#values)

## Constructors

### constructor

• **new MapColumns**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Overrides

Map&lt;string, Column\&gt;.constructor

#### Defined in

[src/classes/system-meta.ts:175](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L175)

## Properties

### [toStringTag]

• `Readonly` **[toStringTag]**: `string`

#### Inherited from

Map.[toStringTag]

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:137

___

### size

• `Readonly` **size**: `number`

#### Inherited from

Map.size

#### Defined in

node_modules/typescript/lib/lib.es2015.collection.d.ts:46

___

### system

• `Private` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-meta.ts:175](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L175)

___

### [species]

▪ `Static` `Readonly` **[species]**: `MapConstructor`

#### Inherited from

Map.[species]

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:319

## Methods

### [iterator]

▸ **[iterator]**(): `IterableIterator`<[`string`, [`Column`](classes_column.Column.md)]\>

Returns an iterable of entries in the map.

#### Returns

`IterableIterator`<[`string`, [`Column`](classes_column.Column.md)]\>

#### Inherited from

Map.[iterator]

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:119

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

Map.clear

#### Defined in

node_modules/typescript/lib/lib.es2015.collection.d.ts:21

___

### delete

▸ **delete**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

true if an element in the Map existed and has been removed, or false if the element does not exist.

#### Inherited from

Map.delete

#### Defined in

node_modules/typescript/lib/lib.es2015.collection.d.ts:25

___

### entries

▸ **entries**(): `IterableIterator`<[`string`, [`Column`](classes_column.Column.md)]\>

Returns an iterable of key, value pairs for every entry in the map.

#### Returns

`IterableIterator`<[`string`, [`Column`](classes_column.Column.md)]\>

#### Inherited from

Map.entries

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:124

___

### forEach

▸ **forEach**(`callbackfn`, `thisArg?`): `void`

Executes a provided function once per each key/value pair in the Map, in insertion order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`value`: [`Column`](classes_column.Column.md), `key`: `string`, `map`: `Map`<`string`, [`Column`](classes_column.Column.md)\>) => `void` |
| `thisArg?` | `any` |

#### Returns

`void`

#### Inherited from

Map.forEach

#### Defined in

node_modules/typescript/lib/lib.es2015.collection.d.ts:29

___

### get

▸ **get**(`key`): [`Column`](classes_column.Column.md)

Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

[`Column`](classes_column.Column.md)

Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.

#### Inherited from

Map.get

#### Defined in

node_modules/typescript/lib/lib.es2015.collection.d.ts:34

___

### has

▸ **has**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

boolean indicating whether an element with the specified key exists or not.

#### Inherited from

Map.has

#### Defined in

node_modules/typescript/lib/lib.es2015.collection.d.ts:38

___

### keys

▸ **keys**(): `IterableIterator`<`string`\>

Returns an iterable of keys in the map

#### Returns

`IterableIterator`<`string`\>

#### Inherited from

Map.keys

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:129

___

### set

▸ **set**(`key`, `value`): [`MapColumns`](classes_system_meta.MapColumns.md)

Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | [`Column`](classes_column.Column.md) |

#### Returns

[`MapColumns`](classes_system_meta.MapColumns.md)

#### Inherited from

Map.set

#### Defined in

node_modules/typescript/lib/lib.es2015.collection.d.ts:42

___

### values

▸ **values**(): `IterableIterator`<[`Column`](classes_column.Column.md)\>

Returns an iterable of values in the map

#### Returns

`IterableIterator`<[`Column`](classes_column.Column.md)\>

#### Inherited from

Map.values

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:134
