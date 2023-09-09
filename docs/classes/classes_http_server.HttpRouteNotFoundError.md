[minted-api](../README.md) / [Exports](../modules.md) / [classes/http-server](../modules/classes_http_server.md) / HttpRouteNotFoundError

# Class: HttpRouteNotFoundError

[classes/http-server](../modules/classes_http_server.md).HttpRouteNotFoundError

## Hierarchy

- [`HttpError`](classes_http_server.HttpError.md)

  ↳ **`HttpRouteNotFoundError`**

## Table of contents

### Constructors

- [constructor](classes_http_server.HttpRouteNotFoundError.md#constructor)

### Properties

- [message](classes_http_server.HttpRouteNotFoundError.md#message)
- [name](classes_http_server.HttpRouteNotFoundError.md#name)
- [stack](classes_http_server.HttpRouteNotFoundError.md#stack)
- [prepareStackTrace](classes_http_server.HttpRouteNotFoundError.md#preparestacktrace)
- [stackTraceLimit](classes_http_server.HttpRouteNotFoundError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_http_server.HttpRouteNotFoundError.md#capturestacktrace)

## Constructors

### constructor

• **new HttpRouteNotFoundError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[HttpError](classes_http_server.HttpError.md).[constructor](classes_http_server.HttpError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1073

## Properties

### message

• **message**: `string`

#### Inherited from

[HttpError](classes_http_server.HttpError.md).[message](classes_http_server.HttpError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

[HttpError](classes_http_server.HttpError.md).[name](classes_http_server.HttpError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[HttpError](classes_http_server.HttpError.md).[stack](classes_http_server.HttpError.md#stack)

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

[HttpError](classes_http_server.HttpError.md).[prepareStackTrace](classes_http_server.HttpError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[HttpError](classes_http_server.HttpError.md).[stackTraceLimit](classes_http_server.HttpError.md#stacktracelimit)

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

[HttpError](classes_http_server.HttpError.md).[captureStackTrace](classes_http_server.HttpError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
