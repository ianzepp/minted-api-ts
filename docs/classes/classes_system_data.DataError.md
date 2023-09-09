[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-data](../modules/classes_system_data.md) / DataError

# Class: DataError

[classes/system-data](../modules/classes_system_data.md).DataError

## Hierarchy

- `Error`

  ↳ **`DataError`**

  ↳↳ [`RecordNotFoundError`](classes_system_data.RecordNotFoundError.md)

  ↳↳ [`RecordColumnImmutableError`](classes_system_data.RecordColumnImmutableError.md)

  ↳↳ [`RecordColumnRequiredError`](classes_system_data.RecordColumnRequiredError.md)

## Table of contents

### Constructors

- [constructor](classes_system_data.DataError.md#constructor)

### Properties

- [message](classes_system_data.DataError.md#message)
- [name](classes_system_data.DataError.md#name)
- [stack](classes_system_data.DataError.md#stack)
- [prepareStackTrace](classes_system_data.DataError.md#preparestacktrace)
- [stackTraceLimit](classes_system_data.DataError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_system_data.DataError.md#capturestacktrace)

## Constructors

### constructor

• **new DataError**(`message?`)

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
