[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-knex](../modules/classes_system_knex.md) / KnexDriverMissingError

# Class: KnexDriverMissingError

[classes/system-knex](../modules/classes_system_knex.md).KnexDriverMissingError

## Hierarchy

- [`KnexError`](classes_system_knex.KnexError.md)

  ↳ **`KnexDriverMissingError`**

## Table of contents

### Constructors

- [constructor](classes_system_knex.KnexDriverMissingError.md#constructor)

### Properties

- [message](classes_system_knex.KnexDriverMissingError.md#message)
- [name](classes_system_knex.KnexDriverMissingError.md#name)
- [stack](classes_system_knex.KnexDriverMissingError.md#stack)
- [prepareStackTrace](classes_system_knex.KnexDriverMissingError.md#preparestacktrace)
- [stackTraceLimit](classes_system_knex.KnexDriverMissingError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_system_knex.KnexDriverMissingError.md#capturestacktrace)

## Constructors

### constructor

• **new KnexDriverMissingError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[KnexError](classes_system_knex.KnexError.md).[constructor](classes_system_knex.KnexError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1073

## Properties

### message

• **message**: `string`

#### Inherited from

[KnexError](classes_system_knex.KnexError.md).[message](classes_system_knex.KnexError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

[KnexError](classes_system_knex.KnexError.md).[name](classes_system_knex.KnexError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[KnexError](classes_system_knex.KnexError.md).[stack](classes_system_knex.KnexError.md#stack)

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

[KnexError](classes_system_knex.KnexError.md).[prepareStackTrace](classes_system_knex.KnexError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[KnexError](classes_system_knex.KnexError.md).[stackTraceLimit](classes_system_knex.KnexError.md#stacktracelimit)

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

[KnexError](classes_system_knex.KnexError.md).[captureStackTrace](classes_system_knex.KnexError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
