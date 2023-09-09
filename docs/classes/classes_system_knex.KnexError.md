[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-knex](../modules/classes_system_knex.md) / KnexError

# Class: KnexError

[classes/system-knex](../modules/classes_system_knex.md).KnexError

## Hierarchy

- `Error`

  ↳ **`KnexError`**

  ↳↳ [`KnexTransactionMissingError`](classes_system_knex.KnexTransactionMissingError.md)

  ↳↳ [`KnexTransactionAlreadyStartedError`](classes_system_knex.KnexTransactionAlreadyStartedError.md)

  ↳↳ [`KnexDriverMissingError`](classes_system_knex.KnexDriverMissingError.md)

## Table of contents

### Constructors

- [constructor](classes_system_knex.KnexError.md#constructor)

### Properties

- [message](classes_system_knex.KnexError.md#message)
- [name](classes_system_knex.KnexError.md#name)
- [stack](classes_system_knex.KnexError.md#stack)
- [prepareStackTrace](classes_system_knex.KnexError.md#preparestacktrace)
- [stackTraceLimit](classes_system_knex.KnexError.md#stacktracelimit)

### Methods

- [captureStackTrace](classes_system_knex.KnexError.md#capturestacktrace)

## Constructors

### constructor

• **new KnexError**(`message?`)

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
