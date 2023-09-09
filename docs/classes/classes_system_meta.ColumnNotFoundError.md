[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-meta](../modules/classes_system_meta.md) / ColumnNotFoundError

# Class: ColumnNotFoundError

[classes/system-meta](../modules/classes_system_meta.md).ColumnNotFoundError

## Hierarchy

- [`MetaError`](classes_system_meta.MetaError.md)

  ↳ **`ColumnNotFoundError`**

## Table of contents

### Constructors

- [constructor](classes_system_meta.ColumnNotFoundError.md#constructor)

### Properties

- [message](classes_system_meta.ColumnNotFoundError.md#message)
- [name](classes_system_meta.ColumnNotFoundError.md#name)
- [stack](classes_system_meta.ColumnNotFoundError.md#stack)
- [prepareStackTrace](classes_system_meta.ColumnNotFoundError.md#preparestacktrace)
- [stackTraceLimit](classes_system_meta.ColumnNotFoundError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_system_meta.ColumnNotFoundError.md#capturestacktrace)

## Constructors

### constructor

• **new ColumnNotFoundError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[MetaError](classes_system_meta.MetaError.md).[constructor](classes_system_meta.MetaError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1073

## Properties

### message

• **message**: `string`

#### Inherited from

[MetaError](classes_system_meta.MetaError.md).[message](classes_system_meta.MetaError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

[MetaError](classes_system_meta.MetaError.md).[name](classes_system_meta.MetaError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[MetaError](classes_system_meta.MetaError.md).[stack](classes_system_meta.MetaError.md#stack)

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

[MetaError](classes_system_meta.MetaError.md).[prepareStackTrace](classes_system_meta.MetaError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[MetaError](classes_system_meta.MetaError.md).[stackTraceLimit](classes_system_meta.MetaError.md#stacktracelimit)

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

[MetaError](classes_system_meta.MetaError.md).[captureStackTrace](classes_system_meta.MetaError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
