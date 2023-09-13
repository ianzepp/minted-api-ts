[minted-api](../README.md) / [Exports](../modules.md) / [classes/system](../modules/classes_system.md) / System

# Class: System

[classes/system](../modules/classes_system.md).System

## Hierarchy

- **`System`**

  ↳ [`SystemAsRoot`](classes_system.SystemAsRoot.md)

  ↳ [`SystemAsTest`](classes_system.SystemAsTest.md)

  ↳ [`SystemAsCors`](classes_system.SystemAsCors.md)

## Table of contents

### Constructors

- [constructor](classes_system.System.md#constructor)

### Properties

- [auth](classes_system.System.md#auth)
- [chai](classes_system.System.md#chai)
- [data](classes_system.System.md#data)
- [errors](classes_system.System.md#errors)
- [expect](classes_system.System.md#expect)
- [knex](classes_system.System.md#knex)
- [meta](classes_system.System.md#meta)
- [time](classes_system.System.md#time)
- [time\_iso](classes_system.System.md#time_iso)
- [user\_id](classes_system.System.md#user_id)
- [user\_ns](classes_system.System.md#user_ns)
- [uuid](classes_system.System.md#uuid)
- [RootId](classes_system.System.md#rootid)
- [RootNs](classes_system.System.md#rootns)
- [SchemaType](classes_system.System.md#schematype)
- [TestId](classes_system.System.md#testid)
- [TestNs](classes_system.System.md#testns)

### Methods

- [authenticate](classes_system.System.md#authenticate)
- [cleanup](classes_system.System.md#cleanup)
- [emit](classes_system.System.md#emit)
- [isProd](classes_system.System.md#isprod)
- [isRoot](classes_system.System.md#isroot)
- [isTest](classes_system.System.md#istest)
- [refresh](classes_system.System.md#refresh)
- [run](classes_system.System.md#run)
- [startup](classes_system.System.md#startup)

## Constructors

### constructor

• **new System**(`user_id`, `user_ns`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `string` |
| `user_ns` | `string` |

#### Defined in

[src/classes/system.ts:50](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L50)

## Properties

### auth

• `Readonly` **auth**: [`SystemAuth`](classes_system_auth.SystemAuth.md)

#### Defined in

[src/classes/system.ts:34](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L34)

___

### chai

• `Readonly` **chai**: `ChaiStatic` = `chai`

#### Defined in

[src/classes/system.ts:47](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L47)

___

### data

• `Readonly` **data**: [`SystemData`](classes_system_data.SystemData.md)

#### Defined in

[src/classes/system.ts:35](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L35)

___

### errors

• `Readonly` **errors**: `Error`[] = `[]`

#### Defined in

[src/classes/system.ts:41](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L41)

___

### expect

• `Readonly` **expect**: `ExpectStatic` = `chai.expect`

#### Defined in

[src/classes/system.ts:40](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L40)

___

### knex

• `Readonly` **knex**: [`SystemKnex`](classes_system_knex.SystemKnex.md)

#### Defined in

[src/classes/system.ts:37](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L37)

___

### meta

• `Readonly` **meta**: [`SystemMeta`](classes_system_meta.SystemMeta.md)

#### Defined in

[src/classes/system.ts:36](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L36)

___

### time

• `Readonly` **time**: `Date`

#### Defined in

[src/classes/system.ts:44](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L44)

___

### time\_iso

• `Readonly` **time\_iso**: `string`

#### Defined in

[src/classes/system.ts:45](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L45)

___

### user\_id

• `Readonly` **user\_id**: `string`

#### Defined in

[src/classes/system.ts:50](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L50)

___

### user\_ns

• `Readonly` **user\_ns**: `string`

#### Defined in

[src/classes/system.ts:50](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L50)

___

### uuid

• `Readonly` **uuid**: `v4` = `uuid`

#### Defined in

[src/classes/system.ts:46](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L46)

___

### RootId

▪ `Static` **RootId**: `string` = `"00000000-0000-0000-0000-000000000000"`

#### Defined in

[src/classes/system.ts:24](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L24)

___

### RootNs

▪ `Static` **RootNs**: `string` = `"system"`

#### Defined in

[src/classes/system.ts:25](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L25)

___

### SchemaType

▪ `Static` **SchemaType**: typeof [`SchemaType`](../enums/classes_schema_type.SchemaType.md) = `SchemaType`

#### Defined in

[src/classes/system.ts:31](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L31)

___

### TestId

▪ `Static` **TestId**: `string` = `"99999999-9999-4999-9999-999999999999"`

#### Defined in

[src/classes/system.ts:27](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L27)

___

### TestNs

▪ `Static` **TestNs**: `string` = `"test"`

#### Defined in

[src/classes/system.ts:28](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L28)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system.ts:59](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L59)

___

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

#### Defined in

[src/classes/system.ts:103](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L103)

___

### isProd

▸ **isProd**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/system.ts:115](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L115)

___

### isRoot

▸ **isRoot**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/system.ts:107](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L107)

___

### isTest

▸ **isTest**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/system.ts:111](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L111)

___

### refresh

▸ **refresh**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

#### Defined in

[src/classes/system.ts:88](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L88)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system.ts:63](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system.ts#L63)
