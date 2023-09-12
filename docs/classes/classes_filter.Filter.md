[minted-api](../README.md) / [Exports](../modules.md) / [classes/filter](../modules/classes_filter.md) / Filter

# Class: Filter

[classes/filter](../modules/classes_filter.md).Filter

Represents the filter's JSON representation in object format.

## Implements

- [`FilterJson`](../interfaces/layouts_filter.FilterJson.md)

## Table of contents

### Constructors

- [constructor](classes_filter.Filter.md#constructor)

### Properties

- [flags](classes_filter.Filter.md#flags)
- [limit](classes_filter.Filter.md#limit)
- [order](classes_filter.Filter.md#order)
- [where](classes_filter.Filter.md#where)
- [Group](classes_filter.Filter.md#group)
- [LimitDefault](classes_filter.Filter.md#limitdefault)
- [LimitMaximum](classes_filter.Filter.md#limitmaximum)
- [LimitMinimum](classes_filter.Filter.md#limitminimum)
- [Order](classes_filter.Filter.md#order-1)
- [Where](classes_filter.Filter.md#where-1)

## Constructors

### constructor

• **new Filter**(`source?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |

#### Defined in

[src/classes/filter.ts:28](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L28)

## Properties

### flags

• `Readonly` **flags**: `Dictionary`<`any`\> = `{}`

#### Implementation of

[FilterJson](../interfaces/layouts_filter.FilterJson.md).[flags](../interfaces/layouts_filter.FilterJson.md#flags)

#### Defined in

[src/classes/filter.ts:25](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L25)

___

### limit

• **limit**: `number` = `Filter.LimitDefault`

#### Implementation of

[FilterJson](../interfaces/layouts_filter.FilterJson.md).[limit](../interfaces/layouts_filter.FilterJson.md#limit)

#### Defined in

[src/classes/filter.ts:26](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L26)

___

### order

• `Readonly` **order**: `Dictionary`<`any`\> = `{}`

#### Implementation of

[FilterJson](../interfaces/layouts_filter.FilterJson.md).[order](../interfaces/layouts_filter.FilterJson.md#order)

#### Defined in

[src/classes/filter.ts:24](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L24)

___

### where

• `Readonly` **where**: `Dictionary`<`any`\> = `{}`

#### Implementation of

[FilterJson](../interfaces/layouts_filter.FilterJson.md).[where](../interfaces/layouts_filter.FilterJson.md#where)

#### Defined in

[src/classes/filter.ts:23](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L23)

___

### Group

▪ `Static` **Group**: typeof [`FilterGroup`](../enums/layouts_filter.FilterGroup.md) = `FilterGroup`

#### Defined in

[src/classes/filter.ts:18](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L18)

___

### LimitDefault

▪ `Static` **LimitDefault**: `number` = `100`

#### Defined in

[src/classes/filter.ts:13](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L13)

___

### LimitMaximum

▪ `Static` **LimitMaximum**: `number` = `10000`

#### Defined in

[src/classes/filter.ts:14](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L14)

___

### LimitMinimum

▪ `Static` **LimitMinimum**: `number` = `0`

#### Defined in

[src/classes/filter.ts:15](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L15)

___

### Order

▪ `Static` **Order**: typeof [`FilterOrder`](../enums/layouts_filter.FilterOrder.md) = `FilterOrder`

#### Defined in

[src/classes/filter.ts:19](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L19)

___

### Where

▪ `Static` **Where**: typeof [`FilterWhere`](../enums/layouts_filter.FilterWhere.md) = `FilterWhere`

#### Defined in

[src/classes/filter.ts:20](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/filter.ts#L20)
