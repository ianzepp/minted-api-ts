[minted-api](../README.md) / [Exports](../modules.md) / classes/system-knex

# Module: classes/system-knex

## Table of contents

### Classes

- [KnexDriverMissingError](../classes/classes_system_knex.KnexDriverMissingError.md)
- [KnexError](../classes/classes_system_knex.KnexError.md)
- [KnexTransactionAlreadyStartedError](../classes/classes_system_knex.KnexTransactionAlreadyStartedError.md)
- [KnexTransactionMissingError](../classes/classes_system_knex.KnexTransactionMissingError.md)
- [SystemKnex](../classes/classes_system_knex.SystemKnex.md)

### Interfaces

- [SystemKnexConfig](../interfaces/classes_system_knex.SystemKnexConfig.md)

### Variables

- [KnexConfig](classes_system_knex.md#knexconfig)
- [KnexConfigTest](classes_system_knex.md#knexconfigtest)

### Functions

- [KnexDriver](classes_system_knex.md#knexdriver)

## Variables

### KnexConfig

• `Const` **KnexConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `client` | `string` |
| `connection` | { `acquireConnectionTimeout`: `number` = 10000; `database`: `string` = Bun.env.POSTGRES\_DB; `host`: `string` = Bun.env.POSTGRES\_HOST; `password`: `string` = Bun.env.POSTGRES\_PASSWORD; `port`: `string` = Bun.env.POSTGRES\_PORT; `user`: `string` = Bun.env.POSTGRES\_USER } |
| `connection.acquireConnectionTimeout` | `number` |
| `connection.database` | `string` |
| `connection.host` | `string` |
| `connection.password` | `string` |
| `connection.port` | `string` |
| `connection.user` | `string` |
| `debug` | `boolean` |
| `pool` | { `max`: `number` = 10; `min`: `number` = 0 } |
| `pool.max` | `number` |
| `pool.min` | `number` |

#### Defined in

[src/classes/system-knex.ts:8](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L8)

___

### KnexConfigTest

• `Const` **KnexConfigTest**: `NonNullable`<{ `client`: `string` = 'postgresql'; `connection`: { `acquireConnectionTimeout`: `number` = 10000; `database`: `string` = Bun.env.POSTGRES\_DB; `host`: `string` = Bun.env.POSTGRES\_HOST; `password`: `string` = Bun.env.POSTGRES\_PASSWORD; `port`: `string` = Bun.env.POSTGRES\_PORT; `user`: `string` = Bun.env.POSTGRES\_USER } ; `debug`: `boolean` ; `pool`: { `max`: `number` = 10; `min`: `number` = 0 }  } & { `pool`: { `max`: `number` = 2; `min`: `number` = 0 }  }\>

#### Defined in

[src/classes/system-knex.ts:26](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/system-knex.ts#L26)

## Functions

### KnexDriver

▸ **KnexDriver**<`TTable`\>(`tableName`, `options?`): `QueryBuilder`<`TableType`<`TTable`\>, `DeferredKeySelection`<`ResolveTableType`<`TableType`<`TTable`\>, ``"base"``\>, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTable` | extends `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `TTable` |
| `options?` | `PgTableOptions` |

#### Returns

`QueryBuilder`<`TableType`<`TTable`\>, `DeferredKeySelection`<`ResolveTableType`<`TableType`<`TTable`\>, ``"base"``\>, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Defined in

node_modules/knex/types/index.d.ts:380

▸ **KnexDriver**<`TRecord2`, `TResult2`\>(`tableName?`, `options?`): `QueryBuilder`<`TRecord2`, `TResult2`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRecord2` | extends `Object` = `any` |
| `TResult2` | `DeferredKeySelection`<`TRecord2`, `never`, ``false``, {}, ``false``, {}, `never`\>[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName?` | `TableDescriptor` \| `AliasDict` |
| `options?` | `PgTableOptions` |

#### Returns

`QueryBuilder`<`TRecord2`, `TResult2`\>

#### Defined in

node_modules/knex/types/index.d.ts:387
