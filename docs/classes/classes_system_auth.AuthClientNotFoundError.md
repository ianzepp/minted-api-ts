[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-auth](../modules/classes_system_auth.md) / AuthClientNotFoundError

# Class: AuthClientNotFoundError

[classes/system-auth](../modules/classes_system_auth.md).AuthClientNotFoundError

## Hierarchy

- [`AuthError`](classes_system_auth.AuthError.md)

  ↳ **`AuthClientNotFoundError`**

## Table of contents

### Constructors

- [constructor](classes_system_auth.AuthClientNotFoundError.md#constructor)

### Properties

- [message](classes_system_auth.AuthClientNotFoundError.md#message)
- [name](classes_system_auth.AuthClientNotFoundError.md#name)
- [stack](classes_system_auth.AuthClientNotFoundError.md#stack)
- [prepareStackTrace](classes_system_auth.AuthClientNotFoundError.md#preparestacktrace)
- [stackTraceLimit](classes_system_auth.AuthClientNotFoundError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_system_auth.AuthClientNotFoundError.md#capturestacktrace)

## Constructors

### constructor

• **new AuthClientNotFoundError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[AuthError](classes_system_auth.AuthError.md).[constructor](classes_system_auth.AuthError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1073

## Properties

### message

• **message**: `string`

#### Inherited from

[AuthError](classes_system_auth.AuthError.md).[message](classes_system_auth.AuthError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

[AuthError](classes_system_auth.AuthError.md).[name](classes_system_auth.AuthError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[AuthError](classes_system_auth.AuthError.md).[stack](classes_system_auth.AuthError.md#stack)

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

[AuthError](classes_system_auth.AuthError.md).[prepareStackTrace](classes_system_auth.AuthError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[AuthError](classes_system_auth.AuthError.md).[stackTraceLimit](classes_system_auth.AuthError.md#stacktracelimit)

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

[AuthError](classes_system_auth.AuthError.md).[captureStackTrace](classes_system_auth.AuthError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
