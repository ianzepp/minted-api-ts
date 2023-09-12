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
- [commit](classes_system_knex.SystemKnex.md#commit)
- [driverTo](classes_system_knex.SystemKnex.md#driverto)
- [rollback](classes_system_knex.SystemKnex.md#rollback)
- [selectTo](classes_system_knex.SystemKnex.md#selectto)
- [startup](classes_system_knex.SystemKnex.md#startup)
- [transaction](classes_system_knex.SystemKnex.md#transaction)
- [transactionFn](classes_system_knex.SystemKnex.md#transactionfn)

## Constructors

### constructor

• **new SystemKnex**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-knex.ts:55](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L55)

## Properties

### db

• **db**: `Knex`<`any`, `any`[]\> = `KnexDriver`

#### Defined in

[src/classes/system-knex.ts:52](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L52)

___

### system

• `Private` `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-knex.ts:55](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L55)

___

### tx

• **tx**: `Transaction`<`any`, `any`[]\>

#### Defined in

[src/classes/system-knex.ts:53](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L53)

## Accessors

### driver

• `get` **driver**(): `Knex`<`any`, `any`[]\>

#### Returns

`Knex`<`any`, `any`[]\>

#### Defined in

[src/classes/system-knex.ts:127](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L127)

___

### fn

• `get` **fn**(): `FunctionHelper`

#### Returns

`FunctionHelper`

#### Defined in

[src/classes/system-knex.ts:119](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L119)

___

### schema

• `get` **schema**(): `SchemaBuilder`

#### Returns

`SchemaBuilder`

#### Defined in

[src/classes/system-knex.ts:123](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L123)

## Methods

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[cleanup](../interfaces/classes_system.SystemService.md#cleanup)

#### Defined in

[src/classes/system-knex.ts:64](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L64)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-knex.ts:99](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L99)

___

### driverTo

▸ **driverTo**<`T`\>(`schema_path`, `alias?`): `QueryBuilder`<`T`, `DeferredKeySelection`<`T`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `Dictionary`<`any`\> |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `schema_path` | `string` | `undefined` |
| `alias` | ``"data"`` \| ``"meta"`` | `'data'` |

#### Returns

`QueryBuilder`<`T`, `DeferredKeySelection`<`T`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Defined in

[src/classes/system-knex.ts:147](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L147)

___

### rollback

▸ **rollback**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[src/classes/system-knex.ts:107](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L107)

___

### selectTo

▸ **selectTo**<`T`\>(`schema_path`): `QueryBuilder`<`any`, `DeferredKeySelection`<`any`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`RecordFlat`](../interfaces/layouts_record.RecordFlat.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_path` | `string` |

#### Returns

`QueryBuilder`<`any`, `DeferredKeySelection`<`any`, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Defined in

[src/classes/system-knex.ts:131](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L131)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[startup](../interfaces/classes_system.SystemService.md#startup)

#### Defined in

[src/classes/system-knex.ts:57](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L57)

___

### transaction

▸ **transaction**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-knex.ts:82](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L82)

___

### transactionFn

▸ **transactionFn**(`runFn`, `config?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `runFn` | () => `Promise`<`any`\> |
| `config?` | `TransactionConfig` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-knex.ts:75](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L75)
