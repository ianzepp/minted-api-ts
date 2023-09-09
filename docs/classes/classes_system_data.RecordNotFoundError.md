[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-data](../modules/classes_system_data.md) / RecordNotFoundError

# Class: RecordNotFoundError

[classes/system-data](../modules/classes_system_data.md).RecordNotFoundError

## Hierarchy

- [`DataError`](classes_system_data.DataError.md)

  ↳ **`RecordNotFoundError`**

## Table of contents

### Constructors

- [constructor](classes_system_data.RecordNotFoundError.md#constructor)

### Properties

- [message](classes_system_data.RecordNotFoundError.md#message)
- [name](classes_system_data.RecordNotFoundError.md#name)
- [stack](classes_system_data.RecordNotFoundError.md#stack)
- [prepareStackTrace](classes_system_data.RecordNotFoundError.md#preparestacktrace)
- [stackTraceLimit](classes_system_data.RecordNotFoundError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_system_data.RecordNotFoundError.md#capturestacktrace)

## Constructors

### constructor

• **new RecordNotFoundError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[DataError](classes_system_data.DataError.md).[constructor](classes_system_data.DataError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1073

## Properties

### message

• **message**: `string`

#### Inherited from

[DataError](classes_system_data.DataError.md).[message](classes_system_data.DataError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

[DataError](classes_system_data.DataError.md).[name](classes_system_data.DataError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[DataError](classes_system_data.DataError.md).[stack](classes_system_data.DataError.md#stack)

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

[DataError](classes_system_data.DataError.md).[prepareStackTrace](classes_system_data.DataError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[DataError](classes_system_data.DataError.md).[stackTraceLimit](classes_system_data.DataError.md#stacktracelimit)

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

[DataError](classes_system_data.DataError.md).[captureStackTrace](classes_system_data.DataError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
