[minted-api](../README.md) / [Exports](../modules.md) / [classes/system](../modules/classes_system.md) / SystemAsCors

# Class: SystemAsCors

[classes/system](../modules/classes_system.md).SystemAsCors

## Hierarchy

- [`System`](classes_system.System.md)

  ↳ **`SystemAsCors`**

## Table of contents

### Constructors

- [constructor](classes_system.SystemAsCors.md#constructor)

### Properties

- [auth](classes_system.SystemAsCors.md#auth)
- [chai](classes_system.SystemAsCors.md#chai)
- [data](classes_system.SystemAsCors.md#data)
- [errors](classes_system.SystemAsCors.md#errors)
- [expect](classes_system.SystemAsCors.md#expect)
- [knex](classes_system.SystemAsCors.md#knex)
- [meta](classes_system.SystemAsCors.md#meta)
- [time](classes_system.SystemAsCors.md#time)
- [time\_iso](classes_system.SystemAsCors.md#time_iso)
- [user\_id](classes_system.SystemAsCors.md#user_id)
- [user\_ns](classes_system.SystemAsCors.md#user_ns)
- [uuid](classes_system.SystemAsCors.md#uuid)
- [RootId](classes_system.SystemAsCors.md#rootid)
- [RootNs](classes_system.SystemAsCors.md#rootns)
- [SchemaType](classes_system.SystemAsCors.md#schematype)
- [TestId](classes_system.SystemAsCors.md#testid)
- [TestNs](classes_system.SystemAsCors.md#testns)

### Methods

- [authenticate](classes_system.SystemAsCors.md#authenticate)
- [cleanup](classes_system.SystemAsCors.md#cleanup)
- [emit](classes_system.SystemAsCors.md#emit)
- [isProd](classes_system.SystemAsCors.md#isprod)
- [isRoot](classes_system.SystemAsCors.md#isroot)
- [isTest](classes_system.SystemAsCors.md#istest)
- [refresh](classes_system.SystemAsCors.md#refresh)
- [run](classes_system.SystemAsCors.md#run)
- [startup](classes_system.SystemAsCors.md#startup)

## Constructors

### constructor

• **new SystemAsCors**(`cookie?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cookie?` | `string` |

#### Overrides

[System](classes_system.System.md).[constructor](classes_system.System.md#constructor)

#### Defined in

[src/classes/system.ts:152](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L152)

## Properties

### auth

• `Readonly` **auth**: [`SystemAuth`](classes_system_auth.SystemAuth.md)

#### Inherited from

[System](classes_system.System.md).[auth](classes_system.System.md#auth)

#### Defined in

[src/classes/system.ts:34](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L34)

___

### chai

• `Readonly` **chai**: `ChaiStatic` = `chai`

#### Inherited from

[System](classes_system.System.md).[chai](classes_system.System.md#chai)

#### Defined in

[src/classes/system.ts:47](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L47)

___

### data

• `Readonly` **data**: [`SystemData`](classes_system_data.SystemData.md)

#### Inherited from

[System](classes_system.System.md).[data](classes_system.System.md#data)

#### Defined in

[src/classes/system.ts:35](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L35)

___

### errors

• `Readonly` **errors**: `Error`[] = `[]`

#### Inherited from

[System](classes_system.System.md).[errors](classes_system.System.md#errors)

#### Defined in

[src/classes/system.ts:41](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L41)

___

### expect

• `Readonly` **expect**: `ExpectStatic` = `chai.expect`

#### Inherited from

[System](classes_system.System.md).[expect](classes_system.System.md#expect)

#### Defined in

[src/classes/system.ts:40](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L40)

___

### knex

• `Readonly` **knex**: [`SystemKnex`](classes_system_knex.SystemKnex.md)

#### Inherited from

[System](classes_system.System.md).[knex](classes_system.System.md#knex)

#### Defined in

[src/classes/system.ts:37](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L37)

___

### meta

• `Readonly` **meta**: [`SystemMeta`](classes_system_meta.SystemMeta.md)

#### Inherited from

[System](classes_system.System.md).[meta](classes_system.System.md#meta)

#### Defined in

[src/classes/system.ts:36](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L36)

___

### time

• `Readonly` **time**: `Date`

#### Inherited from

[System](classes_system.System.md).[time](classes_system.System.md#time)

#### Defined in

[src/classes/system.ts:44](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L44)

___

### time\_iso

• `Readonly` **time\_iso**: `string`

#### Inherited from

[System](classes_system.System.md).[time_iso](classes_system.System.md#time_iso)

#### Defined in

[src/classes/system.ts:45](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L45)

___

### user\_id

• `Readonly` **user\_id**: `string`

#### Inherited from

[System](classes_system.System.md).[user_id](classes_system.System.md#user_id)

#### Defined in

[src/classes/system.ts:50](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L50)

___

### user\_ns

• `Readonly` **user\_ns**: `string`

#### Inherited from

[System](classes_system.System.md).[user_ns](classes_system.System.md#user_ns)

#### Defined in

[src/classes/system.ts:50](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L50)

___

### uuid

• `Readonly` **uuid**: `v4` = `uuid`

#### Inherited from

[System](classes_system.System.md).[uuid](classes_system.System.md#uuid)

#### Defined in

[src/classes/system.ts:46](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L46)

___

### RootId

▪ `Static` **RootId**: `string` = `"00000000-0000-0000-0000-000000000000"`

#### Inherited from

[System](classes_system.System.md).[RootId](classes_system.System.md#rootid)

#### Defined in

[src/classes/system.ts:24](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L24)

___

### RootNs

▪ `Static` **RootNs**: `string` = `"system"`

#### Inherited from

[System](classes_system.System.md).[RootNs](classes_system.System.md#rootns)

#### Defined in

[src/classes/system.ts:25](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L25)

___

### SchemaType

▪ `Static` **SchemaType**: typeof [`SchemaType`](../enums/classes_schema_type.SchemaType.md) = `SchemaType`

#### Inherited from

[System](classes_system.System.md).[SchemaType](classes_system.System.md#schematype)

#### Defined in

[src/classes/system.ts:31](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L31)

___

### TestId

▪ `Static` **TestId**: `string` = `"99999999-9999-4999-9999-999999999999"`

#### Inherited from

[System](classes_system.System.md).[TestId](classes_system.System.md#testid)

#### Defined in

[src/classes/system.ts:27](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L27)

___

### TestNs

▪ `Static` **TestNs**: `string` = `"test"`

#### Inherited from

[System](classes_system.System.md).[TestNs](classes_system.System.md#testns)

#### Defined in

[src/classes/system.ts:28](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L28)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[System](classes_system.System.md).[authenticate](classes_system.System.md#authenticate)

#### Defined in

[src/classes/system.ts:59](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L59)

___

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[System](classes_system.System.md).[cleanup](classes_system.System.md#cleanup)

#### Defined in

[src/classes/system.ts:73](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L73)

___

### emit

▸ **emit**(`cn`, `fn`, `...messages`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cn` | `any` |
| `fn` | `any` |
| `...messages` | `any`[] |

#### Returns

`void`

#### Inherited from

[System](classes_system.System.md).[emit](classes_system.System.md#emit)

#### Defined in

[src/classes/system.ts:103](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L103)

___

### isProd

▸ **isProd**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[System](classes_system.System.md).[isProd](classes_system.System.md#isprod)

#### Defined in

[src/classes/system.ts:115](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L115)

___

### isRoot

▸ **isRoot**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[System](classes_system.System.md).[isRoot](classes_system.System.md#isroot)

#### Defined in

[src/classes/system.ts:107](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L107)

___

### isTest

▸ **isTest**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[System](classes_system.System.md).[isTest](classes_system.System.md#istest)

#### Defined in

[src/classes/system.ts:111](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L111)

___

### refresh

▸ **refresh**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[System](classes_system.System.md).[refresh](classes_system.System.md#refresh)

#### Defined in

[src/classes/system.ts:83](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L83)

___

### run

▸ **run**(`executeFn`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executeFn` | (`system`: [`System`](classes_system.System.md)) => `Promise`<`any`\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[System](classes_system.System.md).[run](classes_system.System.md#run)

#### Defined in

[src/classes/system.ts:88](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L88)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[System](classes_system.System.md).[startup](classes_system.System.md#startup)

#### Defined in

[src/classes/system.ts:63](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L63)
