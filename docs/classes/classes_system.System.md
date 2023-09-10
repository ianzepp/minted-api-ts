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
- [data](classes_system.System.md#data)
- [errors](classes_system.System.md#errors)
- [expect](classes_system.System.md#expect)
- [knex](classes_system.System.md#knex)
- [meta](classes_system.System.md#meta)
- [timestamp](classes_system.System.md#timestamp)
- [user\_id](classes_system.System.md#user_id)
- [user\_ns](classes_system.System.md#user_ns)
- [RootId](classes_system.System.md#rootid)
- [RootNs](classes_system.System.md#rootns)
- [TestId](classes_system.System.md#testid)
- [TestNs](classes_system.System.md#testns)

### Methods

- [authenticate](classes_system.System.md#authenticate)
- [cleanup](classes_system.System.md#cleanup)
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

[src/classes/system.ts:38](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L38)

## Properties

### auth

• `Readonly` **auth**: [`SystemAuth`](classes_system_auth.SystemAuth.md)

#### Defined in

[src/classes/system.ts:25](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L25)

___

### data

• `Readonly` **data**: [`SystemData`](classes_system_data.SystemData.md)

#### Defined in

[src/classes/system.ts:26](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L26)

___

### errors

• `Readonly` **errors**: `Error`[] = `[]`

#### Defined in

[src/classes/system.ts:32](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L32)

___

### expect

• `Readonly` **expect**: `ExpectStatic` = `chai.expect`

#### Defined in

[src/classes/system.ts:31](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L31)

___

### knex

• `Readonly` **knex**: [`SystemKnex`](classes_system_knex.SystemKnex.md)

#### Defined in

[src/classes/system.ts:28](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L28)

___

### meta

• `Readonly` **meta**: [`SystemMeta`](classes_system_meta.SystemMeta.md)

#### Defined in

[src/classes/system.ts:27](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L27)

___

### timestamp

• `Readonly` **timestamp**: `string`

#### Defined in

[src/classes/system.ts:35](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L35)

___

### user\_id

• `Readonly` **user\_id**: `string`

#### Defined in

[src/classes/system.ts:38](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L38)

___

### user\_ns

• `Readonly` **user\_ns**: `string`

#### Defined in

[src/classes/system.ts:38](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L38)

___

### RootId

▪ `Static` **RootId**: `string` = `"00000000-0000-0000-0000-000000000000"`

#### Defined in

[src/classes/system.ts:18](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L18)

___

### RootNs

▪ `Static` **RootNs**: `string` = `"system"`

#### Defined in

[src/classes/system.ts:19](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L19)

___

### TestId

▪ `Static` **TestId**: `string` = `"99999999-9999-4999-9999-999999999999"`

#### Defined in

[src/classes/system.ts:21](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L21)

___

### TestNs

▪ `Static` **TestNs**: `string` = `"test"`

#### Defined in

[src/classes/system.ts:22](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L22)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<[`System`](classes_system.System.md)\>

#### Returns

`Promise`<[`System`](classes_system.System.md)\>

#### Defined in

[src/classes/system.ts:47](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L47)

___

### cleanup

▸ **cleanup**(): `Promise`<[`System`](classes_system.System.md)\>

#### Returns

`Promise`<[`System`](classes_system.System.md)\>

#### Defined in

[src/classes/system.ts:67](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L67)

___

### isProd

▸ **isProd**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/system.ts:111](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L111)

___

### isRoot

▸ **isRoot**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/system.ts:103](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L103)

___

### isTest

▸ **isTest**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/system.ts:107](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L107)

___

### refresh

▸ **refresh**(): `Promise`<[`System`](classes_system.System.md)\>

#### Returns

`Promise`<[`System`](classes_system.System.md)\>

#### Defined in

[src/classes/system.ts:80](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L80)

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

[src/classes/system.ts:88](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L88)

___

### startup

▸ **startup**(): `Promise`<[`System`](classes_system.System.md)\>

#### Returns

`Promise`<[`System`](classes_system.System.md)\>

#### Defined in

[src/classes/system.ts:54](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L54)
