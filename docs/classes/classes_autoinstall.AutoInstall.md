[minted-api](../README.md) / [Exports](../modules.md) / [classes/autoinstall](../modules/classes_autoinstall.md) / AutoInstall

# Class: AutoInstall

[classes/autoinstall](../modules/classes_autoinstall.md).AutoInstall

## Table of contents

### Constructors

- [constructor](classes_autoinstall.AutoInstall.md#constructor)

### Properties

- [system](classes_autoinstall.AutoInstall.md#system)

### Accessors

- [knex](classes_autoinstall.AutoInstall.md#knex)

### Methods

- [createTable](classes_autoinstall.AutoInstall.md#createtable)
- [deleteTable](classes_autoinstall.AutoInstall.md#deletetable)
- [insertAll](classes_autoinstall.AutoInstall.md#insertall)
- [up](classes_autoinstall.AutoInstall.md#up)

## Constructors

### constructor

• **new AutoInstall**(`system?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/autoinstall.ts:8](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/autoinstall.ts#L8)

## Properties

### system

• `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/autoinstall.ts:8](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/autoinstall.ts#L8)

## Accessors

### knex

• `get` **knex**(): `Knex`<`any`, `any`[]\>

#### Returns

`Knex`<`any`, `any`[]\>

#### Defined in

[src/classes/autoinstall.ts:10](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/autoinstall.ts#L10)

## Methods

### createTable

▸ **createTable**(`schema_path`, `columnFn`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_path` | `string` |
| `columnFn` | (`table`: `CreateTableBuilder`) => `void` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/autoinstall.ts:159](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/autoinstall.ts#L159)

___

### deleteTable

▸ **deleteTable**(`schema_path`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_path` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/autoinstall.ts:240](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/autoinstall.ts#L240)

___

### insertAll

▸ **insertAll**(`schema_path`, `record_rows`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_path` | `string` |
| `record_rows` | `Dictionary`<`any`\>[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/autoinstall.ts:255](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/autoinstall.ts#L255)

___

### up

▸ **up**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/autoinstall.ts:14](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/autoinstall.ts#L14)
