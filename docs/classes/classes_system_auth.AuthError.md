[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-auth](../modules/classes_system_auth.md) / AuthError

# Class: AuthError

[classes/system-auth](../modules/classes_system_auth.md).AuthError

## Hierarchy

- `Error`

  ↳ **`AuthError`**

  ↳↳ [`AuthUserNotFoundError`](classes_system_auth.AuthUserNotFoundError.md)

  ↳↳ [`AuthClientNotFoundError`](classes_system_auth.AuthClientNotFoundError.md)

## Table of contents

### Constructors

- [constructor](classes_system_auth.AuthError.md#constructor)

### Properties

- [message](classes_system_auth.AuthError.md#message)
- [name](classes_system_auth.AuthError.md#name)
- [stack](classes_system_auth.AuthError.md#stack)
- [prepareStackTrace](classes_system_auth.AuthError.md#preparestacktrace)
- [stackTraceLimit](classes_system_auth.AuthError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_system_auth.AuthError.md#capturestacktrace)

## Constructors

### constructor

• **new AuthError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1073

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1069

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
