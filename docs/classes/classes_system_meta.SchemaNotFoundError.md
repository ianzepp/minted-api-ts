[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-meta](../modules/classes_system_meta.md) / SchemaNotFoundError

# Class: SchemaNotFoundError

[classes/system-meta](../modules/classes_system_meta.md).SchemaNotFoundError

## Hierarchy

- [`MetaError`](classes_system_meta.MetaError.md)

  ↳ **`SchemaNotFoundError`**

## Table of contents

### Constructors

- [constructor](classes_system_meta.SchemaNotFoundError.md#constructor)

### Properties

- [cause](classes_system_meta.SchemaNotFoundError.md#cause)
- [message](classes_system_meta.SchemaNotFoundError.md#message)
- [name](classes_system_meta.SchemaNotFoundError.md#name)
- [stack](classes_system_meta.SchemaNotFoundError.md#stack)
- [prepareStackTrace](classes_system_meta.SchemaNotFoundError.md#preparestacktrace)
- [stackTraceLimit](classes_system_meta.SchemaNotFoundError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_system_meta.SchemaNotFoundError.md#capturestacktrace)

## Constructors

### constructor

• **new SchemaNotFoundError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[MetaError](classes_system_meta.MetaError.md).[constructor](classes_system_meta.MetaError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1073

• **new SchemaNotFoundError**(`message?`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `options?` | `ErrorOptions` |

#### Inherited from

[MetaError](classes_system_meta.MetaError.md).[constructor](classes_system_meta.MetaError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:28

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

[MetaError](classes_system_meta.MetaError.md).[cause](classes_system_meta.MetaError.md#cause)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

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

node_modules/bun-types/types.d.ts:4093

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[MetaError](classes_system_meta.MetaError.md).[stackTraceLimit](classes_system_meta.MetaError.md#stacktracelimit)

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

[MetaError](classes_system_meta.MetaError.md).[captureStackTrace](classes_system_meta.MetaError.md#capturestacktrace)

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

[MetaError](classes_system_meta.MetaError.md).[captureStackTrace](classes_system_meta.MetaError.md#capturestacktrace)

#### Defined in

node_modules/bun-types/types.d.ts:4086
