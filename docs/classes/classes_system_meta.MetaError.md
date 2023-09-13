[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-meta](../modules/classes_system_meta.md) / MetaError

# Class: MetaError

[classes/system-meta](../modules/classes_system_meta.md).MetaError

## Hierarchy

- `Error`

  ↳ **`MetaError`**

  ↳↳ [`SchemaNotFoundError`](classes_system_meta.SchemaNotFoundError.md)

  ↳↳ [`ColumnNotFoundError`](classes_system_meta.ColumnNotFoundError.md)

## Table of contents

### Constructors

- [constructor](classes_system_meta.MetaError.md#constructor)

### Properties

- [cause](classes_system_meta.MetaError.md#cause)
- [message](classes_system_meta.MetaError.md#message)
- [name](classes_system_meta.MetaError.md#name)
- [stack](classes_system_meta.MetaError.md#stack)
- [prepareStackTrace](classes_system_meta.MetaError.md#preparestacktrace)
- [stackTraceLimit](classes_system_meta.MetaError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_system_meta.MetaError.md#capturestacktrace)

## Constructors

### constructor

• **new MetaError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1073

• **new MetaError**(`message?`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `options?` | `ErrorOptions` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:28

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

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

node_modules/bun-types/types.d.ts:4093

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

node_modules/bun-types/types.d.ts:4097

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

node_modules/bun-types/types.d.ts:4086
