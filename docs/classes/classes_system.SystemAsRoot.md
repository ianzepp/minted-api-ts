[minted-api](../README.md) / [Exports](../modules.md) / [classes/system](../modules/classes_system.md) / SystemAsRoot

# Class: SystemAsRoot

[classes/system](../modules/classes_system.md).SystemAsRoot

## Hierarchy

- [`System`](classes_system.System.md)

  ↳ **`SystemAsRoot`**

## Table of contents

### Constructors

- [constructor](classes_system.SystemAsRoot.md#constructor)

### Properties

- [auth](classes_system.SystemAsRoot.md#auth)
- [data](classes_system.SystemAsRoot.md#data)
- [errors](classes_system.SystemAsRoot.md#errors)
- [expect](classes_system.SystemAsRoot.md#expect)
- [knex](classes_system.SystemAsRoot.md#knex)
- [meta](classes_system.SystemAsRoot.md#meta)
- [timestamp](classes_system.SystemAsRoot.md#timestamp)
- [user\_id](classes_system.SystemAsRoot.md#user_id)
- [user\_ns](classes_system.SystemAsRoot.md#user_ns)
- [RootId](classes_system.SystemAsRoot.md#rootid)
- [RootNs](classes_system.SystemAsRoot.md#rootns)
- [TestId](classes_system.SystemAsRoot.md#testid)
- [TestNs](classes_system.SystemAsRoot.md#testns)

### Methods

- [authenticate](classes_system.SystemAsRoot.md#authenticate)
- [cleanup](classes_system.SystemAsRoot.md#cleanup)
- [isProd](classes_system.SystemAsRoot.md#isprod)
- [isRoot](classes_system.SystemAsRoot.md#isroot)
- [isTest](classes_system.SystemAsRoot.md#istest)
- [refresh](classes_system.SystemAsRoot.md#refresh)
- [run](classes_system.SystemAsRoot.md#run)
- [startup](classes_system.SystemAsRoot.md#startup)

## Constructors

### constructor

• **new SystemAsRoot**()

#### Overrides

[System](classes_system.System.md).[constructor](classes_system.System.md#constructor)

#### Defined in

[src/classes/system.ts:117](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L117)

## Properties

### auth

• `Readonly` **auth**: [`SystemAuth`](classes_system_auth.SystemAuth.md)

#### Inherited from

[System](classes_system.System.md).[auth](classes_system.System.md#auth)

#### Defined in

[src/classes/system.ts:25](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L25)

___

### data

• `Readonly` **data**: [`SystemData`](classes_system_data.SystemData.md)

#### Inherited from

[System](classes_system.System.md).[data](classes_system.System.md#data)

#### Defined in

[src/classes/system.ts:26](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L26)

___

### errors

• `Readonly` **errors**: `Error`[] = `[]`

#### Inherited from

[System](classes_system.System.md).[errors](classes_system.System.md#errors)

#### Defined in

[src/classes/system.ts:32](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L32)

___

### expect

• `Readonly` **expect**: `ExpectStatic` = `chai.expect`

#### Inherited from

[System](classes_system.System.md).[expect](classes_system.System.md#expect)

#### Defined in

[src/classes/system.ts:31](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L31)

___

### knex

• `Readonly` **knex**: [`SystemKnex`](classes_system_knex.SystemKnex.md)

#### Inherited from

[System](classes_system.System.md).[knex](classes_system.System.md#knex)

#### Defined in

[src/classes/system.ts:28](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L28)

___

### meta

• `Readonly` **meta**: [`SystemMeta`](classes_system_meta.SystemMeta.md)

#### Inherited from

[System](classes_system.System.md).[meta](classes_system.System.md#meta)

#### Defined in

[src/classes/system.ts:27](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L27)

___

### timestamp

• `Readonly` **timestamp**: `string`

#### Inherited from

[System](classes_system.System.md).[timestamp](classes_system.System.md#timestamp)

#### Defined in

[src/classes/system.ts:35](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L35)

___

### user\_id

• `Readonly` **user\_id**: `string`

#### Inherited from

[System](classes_system.System.md).[user_id](classes_system.System.md#user_id)

#### Defined in

[src/classes/system.ts:38](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L38)

___

### user\_ns

• `Readonly` **user\_ns**: `string`

#### Inherited from

[System](classes_system.System.md).[user_ns](classes_system.System.md#user_ns)

#### Defined in

[src/classes/system.ts:38](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L38)

___

### RootId

▪ `Static` **RootId**: `string` = `"00000000-0000-0000-0000-000000000000"`

#### Inherited from

[System](classes_system.System.md).[RootId](classes_system.System.md#rootid)

#### Defined in

[src/classes/system.ts:18](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L18)

___

### RootNs

▪ `Static` **RootNs**: `string` = `"system"`

#### Inherited from

[System](classes_system.System.md).[RootNs](classes_system.System.md#rootns)

#### Defined in

[src/classes/system.ts:19](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L19)

___

### TestId

▪ `Static` **TestId**: `string` = `"99999999-9999-4999-9999-999999999999"`

#### Inherited from

[System](classes_system.System.md).[TestId](classes_system.System.md#testid)

#### Defined in

[src/classes/system.ts:21](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L21)

___

### TestNs

▪ `Static` **TestNs**: `string` = `"test"`

#### Inherited from

[System](classes_system.System.md).[TestNs](classes_system.System.md#testns)

#### Defined in

[src/classes/system.ts:22](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L22)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<[`SystemAsRoot`](classes_system.SystemAsRoot.md)\>

#### Returns

`Promise`<[`SystemAsRoot`](classes_system.SystemAsRoot.md)\>

#### Inherited from

[System](classes_system.System.md).[authenticate](classes_system.System.md#authenticate)

#### Defined in

[src/classes/system.ts:47](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L47)

___

### cleanup

▸ **cleanup**(): `Promise`<[`SystemAsRoot`](classes_system.SystemAsRoot.md)\>

#### Returns

`Promise`<[`SystemAsRoot`](classes_system.SystemAsRoot.md)\>

#### Inherited from

[System](classes_system.System.md).[cleanup](classes_system.System.md#cleanup)

#### Defined in

[src/classes/system.ts:67](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L67)

___

### isProd

▸ **isProd**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[System](classes_system.System.md).[isProd](classes_system.System.md#isprod)

#### Defined in

[src/classes/system.ts:111](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L111)

___

### isRoot

▸ **isRoot**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[System](classes_system.System.md).[isRoot](classes_system.System.md#isroot)

#### Defined in

[src/classes/system.ts:103](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L103)

___

### isTest

▸ **isTest**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[System](classes_system.System.md).[isTest](classes_system.System.md#istest)

#### Defined in

[src/classes/system.ts:107](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L107)

___

### refresh

▸ **refresh**(): `Promise`<[`SystemAsRoot`](classes_system.SystemAsRoot.md)\>

#### Returns

`Promise`<[`SystemAsRoot`](classes_system.SystemAsRoot.md)\>

#### Inherited from

[System](classes_system.System.md).[refresh](classes_system.System.md#refresh)

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

#### Inherited from

[System](classes_system.System.md).[run](classes_system.System.md#run)

#### Defined in

[src/classes/system.ts:88](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L88)

___

### startup

▸ **startup**(): `Promise`<[`SystemAsRoot`](classes_system.SystemAsRoot.md)\>

#### Returns

`Promise`<[`SystemAsRoot`](classes_system.SystemAsRoot.md)\>

#### Inherited from

[System](classes_system.System.md).[startup](classes_system.System.md#startup)

#### Defined in

[src/classes/system.ts:54](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system.ts#L54)
