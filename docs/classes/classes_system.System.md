[minted-api](../README.md) / [Exports](../modules.md) / [classes/system](../modules/classes_system.md) / System

# Class: System

[classes/system](../modules/classes_system.md).System

## Table of contents

### Constructors

- [constructor](classes_system.System.md#constructor)

### Properties

- [data](classes_system.System.md#data)
- [http](classes_system.System.md#http)
- [is\_root](classes_system.System.md#is_root)
- [knex](classes_system.System.md#knex)
- [meta](classes_system.System.md#meta)
- [timestamp](classes_system.System.md#timestamp)
- [user](classes_system.System.md#user)

### Accessors

- [namespaces](classes_system.System.md#namespaces)

### Methods

- [startup](classes_system.System.md#startup)

## Constructors

### constructor

• **new System**(`user?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`SystemUser`](../interfaces/layouts_system.SystemUser.md) |

#### Defined in

[src/classes/system.ts:30](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L30)

## Properties

### data

• `Readonly` **data**: [`SystemData`](classes_system_data.SystemData.md)

#### Defined in

[src/classes/system.ts:18](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L18)

___

### http

• `Readonly` **http**: [`SystemHttp`](classes_system_http.SystemHttp.md)

#### Defined in

[src/classes/system.ts:21](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L21)

___

### is\_root

• `Readonly` **is\_root**: `boolean`

#### Defined in

[src/classes/system.ts:27](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L27)

___

### knex

• `Readonly` **knex**: [`SystemKnex`](classes_system_knex.SystemKnex.md)

#### Defined in

[src/classes/system.ts:20](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L20)

___

### meta

• `Readonly` **meta**: [`SystemMeta`](classes_system_meta.SystemMeta.md)

#### Defined in

[src/classes/system.ts:19](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L19)

___

### timestamp

• `Readonly` **timestamp**: `string`

#### Defined in

[src/classes/system.ts:24](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L24)

___

### user

• `Readonly` **user**: [`SystemUser`](../interfaces/layouts_system.SystemUser.md)

#### Defined in

[src/classes/system.ts:30](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L30)

## Accessors

### namespaces

• `get` **namespaces**(): `string`[]

#### Returns

`string`[]

#### Defined in

[src/classes/system.ts:34](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L34)

## Methods

### startup

▸ **startup**(): `Promise`<[`System`](classes_system.System.md)\>

Startup the system

#### Returns

`Promise`<[`System`](classes_system.System.md)\>

#### Defined in

[src/classes/system.ts:39](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system.ts#L39)
