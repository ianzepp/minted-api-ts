[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-meta](../modules/classes_system_meta.md) / MapSchemas

# Class: MapSchemas

[classes/system-meta](../modules/classes_system_meta.md).MapSchemas

## Hierarchy

- `Map`<`string`, [`Schema`](classes_schema.Schema.md)\>

  ↳ **`MapSchemas`**

## Table of contents

### Constructors

- [constructor](classes_system_meta.MapSchemas.md#constructor)

### Properties

- [[toStringTag]](classes_system_meta.MapSchemas.md#[tostringtag])
- [size](classes_system_meta.MapSchemas.md#size)
- [system](classes_system_meta.MapSchemas.md#system)
- [[species]](classes_system_meta.MapSchemas.md#[species])

### Methods

- [[iterator]](classes_system_meta.MapSchemas.md#[iterator])
- [clear](classes_system_meta.MapSchemas.md#clear)
- [delete](classes_system_meta.MapSchemas.md#delete)
- [entries](classes_system_meta.MapSchemas.md#entries)
- [forEach](classes_system_meta.MapSchemas.md#foreach)
- [get](classes_system_meta.MapSchemas.md#get)
- [has](classes_system_meta.MapSchemas.md#has)
- [keys](classes_system_meta.MapSchemas.md#keys)
- [set](classes_system_meta.MapSchemas.md#set)
- [values](classes_system_meta.MapSchemas.md#values)

## Constructors

### constructor

• **new MapSchemas**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Overrides

Map&lt;string, Schema\&gt;.constructor

#### Defined in

[src/classes/system-meta.ts:129](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L129)

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

[src/classes/system-meta.ts:129](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L129)

___

### [species]

▪ `Static` `Readonly` **[species]**: `MapConstructor`

#### Inherited from

Map.[species]

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:319

## Methods

### [iterator]

▸ **[iterator]**(): `IterableIterator`<[`string`, [`Schema`](classes_schema.Schema.md)]\>

Returns an iterable of entries in the map.

#### Returns

`IterableIterator`<[`string`, [`Schema`](classes_schema.Schema.md)]\>

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

▸ **entries**(): `IterableIterator`<[`string`, [`Schema`](classes_schema.Schema.md)]\>

Returns an iterable of key, value pairs for every entry in the map.

#### Returns

`IterableIterator`<[`string`, [`Schema`](classes_schema.Schema.md)]\>

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
| `callbackfn` | (`value`: [`Schema`](classes_schema.Schema.md), `key`: `string`, `map`: `Map`<`string`, [`Schema`](classes_schema.Schema.md)\>) => `void` |
| `thisArg?` | `any` |

#### Returns

`void`

#### Inherited from

Map.forEach

#### Defined in

node_modules/typescript/lib/lib.es2015.collection.d.ts:29

___

### get

▸ **get**(`schema_name`): [`Schema`](classes_schema.Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |

#### Returns

[`Schema`](classes_schema.Schema.md)

#### Overrides

Map.get

#### Defined in

[src/classes/system-meta.ts:133](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-meta.ts#L133)

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

▸ **set**(`key`, `value`): [`MapSchemas`](classes_system_meta.MapSchemas.md)

Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | [`Schema`](classes_schema.Schema.md) |

#### Returns

[`MapSchemas`](classes_system_meta.MapSchemas.md)

#### Inherited from

Map.set

#### Defined in

node_modules/typescript/lib/lib.es2015.collection.d.ts:42

___

### values

▸ **values**(): `IterableIterator`<[`Schema`](classes_schema.Schema.md)\>

Returns an iterable of values in the map

#### Returns

`IterableIterator`<[`Schema`](classes_schema.Schema.md)\>

#### Inherited from

Map.values

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:134
