[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-auth](../modules/classes_system_auth.md) / SystemAuth

# Class: SystemAuth

[classes/system-auth](../modules/classes_system_auth.md).SystemAuth

## Implements

- [`SystemService`](../interfaces/classes_system.SystemService.md)

## Table of contents

### Constructors

- [constructor](classes_system_auth.SystemAuth.md#constructor)

### Properties

- [system](classes_system_auth.SystemAuth.md#system)
- [JWT\_OPTION](classes_system_auth.SystemAuth.md#jwt_option)
- [JWT\_SECRET](classes_system_auth.SystemAuth.md#jwt_secret)

### Accessors

- [id](classes_system_auth.SystemAuth.md#id)
- [namespaces](classes_system_auth.SystemAuth.md#namespaces)
- [ns](classes_system_auth.SystemAuth.md#ns)

### Methods

- [authenticate](classes_system_auth.SystemAuth.md#authenticate)
- [cleanup](classes_system_auth.SystemAuth.md#cleanup)
- [signin](classes_system_auth.SystemAuth.md#signin)
- [signup](classes_system_auth.SystemAuth.md#signup)
- [startup](classes_system_auth.SystemAuth.md#startup)

## Constructors

### constructor

• **new SystemAuth**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-auth.ts:24](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L24)

## Properties

### system

• `Private` `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-auth.ts:24](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L24)

___

### JWT\_OPTION

▪ `Static` `Private` **JWT\_OPTION**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expiresIn` | `string` |

#### Defined in

[src/classes/system-auth.ts:22](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L22)

___

### JWT\_SECRET

▪ `Static` `Private` **JWT\_SECRET**: `string`

#### Defined in

[src/classes/system-auth.ts:21](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L21)

## Accessors

### id

• `get` **id**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/system-auth.ts:26](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L26)

___

### namespaces

• `get` **namespaces**(): `string`[]

#### Returns

`string`[]

#### Defined in

[src/classes/system-auth.ts:34](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L34)

___

### ns

• `get` **ns**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/system-auth.ts:30](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L30)

## Methods

### authenticate

▸ **authenticate**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[src/classes/system-auth.ts:41](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L41)

___

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[cleanup](../interfaces/classes_system.SystemService.md#cleanup)

#### Defined in

[src/classes/system-auth.ts:39](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L39)

___

### signin

▸ **signin**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[src/classes/system-auth.ts:55](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L55)

___

### signup

▸ **signup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-auth.ts:62](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L62)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[startup](../interfaces/classes_system.SystemService.md#startup)

#### Defined in

[src/classes/system-auth.ts:38](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-auth.ts#L38)
