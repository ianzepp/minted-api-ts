[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-knex](../modules/classes_system_knex.md) / SystemKnex

# Class: SystemKnex

[classes/system-knex](../modules/classes_system_knex.md).SystemKnex

## Implements

- [`SystemService`](../interfaces/classes_system.SystemService.md)

## Table of contents

### Constructors

- [constructor](classes_system_knex.SystemKnex.md#constructor)

### Properties

- [db](classes_system_knex.SystemKnex.md#db)
- [system](classes_system_knex.SystemKnex.md#system)
- [tx](classes_system_knex.SystemKnex.md#tx)

### Accessors

- [driver](classes_system_knex.SystemKnex.md#driver)
- [fn](classes_system_knex.SystemKnex.md#fn)
- [schema](classes_system_knex.SystemKnex.md#schema)

### Methods

- [cleanup](classes_system_knex.SystemKnex.md#cleanup)
- [startup](classes_system_knex.SystemKnex.md#startup)

## Constructors

### constructor

• **new SystemKnex**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-knex.ts:47](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-knex.ts#L47)

## Properties

### db

• `Readonly` **db**: `Knex`<`any`, `any`[]\>

#### Defined in

[src/classes/system-knex.ts:44](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-knex.ts#L44)

___

### system

• `Private` `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-knex.ts:47](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-knex.ts#L47)

___

### tx

• **tx**: `Transaction`<`any`, `any`[]\>

#### Defined in

[src/classes/system-knex.ts:45](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-knex.ts#L45)

## Accessors

### driver

• `get` **driver**(): `Knex`<`any`, `any`[]\>

#### Returns

`Knex`<`any`, `any`[]\>

#### Defined in

[src/classes/system-knex.ts:65](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-knex.ts#L65)

___

### fn

• `get` **fn**(): `FunctionHelper`

#### Returns

`FunctionHelper`

#### Defined in

[src/classes/system-knex.ts:73](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-knex.ts#L73)

___

### schema

• `get` **schema**(): `SchemaBuilder`

#### Returns

`SchemaBuilder`

#### Defined in

[src/classes/system-knex.ts:57](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-knex.ts#L57)

## Methods

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[cleanup](../interfaces/classes_system.SystemService.md#cleanup)

#### Defined in

[src/classes/system-knex.ts:85](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-knex.ts#L85)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[startup](../interfaces/classes_system.SystemService.md#startup)

#### Defined in

[src/classes/system-knex.ts:77](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-knex.ts#L77)
