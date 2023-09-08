[minted-api](../README.md) / [Exports](../modules.md) / classes/knex

# Module: classes/knex

## Table of contents

### Functions

- [KnexDriver](classes_knex.md#knexdriver)

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
