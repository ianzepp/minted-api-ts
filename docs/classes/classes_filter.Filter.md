[minted-api](../README.md) / [Exports](../modules.md) / [classes/filter](../modules/classes_filter.md) / Filter

# Class: Filter

[classes/filter](../modules/classes_filter.md).Filter

Represents the architecture needed to obtain a filter's info.

## Implements

- [`FilterInfo`](../interfaces/layouts_filter.FilterInfo.md)

## Table of contents

### Constructors

- [constructor](classes_filter.Filter.md#constructor)

### Properties

- [flags](classes_filter.Filter.md#flags)
- [limit](classes_filter.Filter.md#limit)
- [order](classes_filter.Filter.md#order)
- [using](classes_filter.Filter.md#using)
- [where](classes_filter.Filter.md#where)
- [Group](classes_filter.Filter.md#group)
- [LimitDefault](classes_filter.Filter.md#limitdefault)
- [LimitMaximum](classes_filter.Filter.md#limitmaximum)
- [LimitMinimum](classes_filter.Filter.md#limitminimum)
- [Order](classes_filter.Filter.md#order-1)
- [Where](classes_filter.Filter.md#where-1)

### Methods

- [toJSON](classes_filter.Filter.md#tojson)

## Constructors

### constructor

• **new Filter**(`using`, `source?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `using` | `string` |
| `source?` | `Partial`<[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)\> |

#### Defined in

[src/classes/filter.ts:38](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L38)

## Properties

### flags

• `Readonly` **flags**: `Dictionary`<`any`\> = `{}`

#### Implementation of

[FilterInfo](../interfaces/layouts_filter.FilterInfo.md).[flags](../interfaces/layouts_filter.FilterInfo.md#flags)

#### Defined in

[src/classes/filter.ts:35](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L35)

___

### limit

• **limit**: `number` = `Filter.LimitDefault`

#### Implementation of

[FilterInfo](../interfaces/layouts_filter.FilterInfo.md).[limit](../interfaces/layouts_filter.FilterInfo.md#limit)

#### Defined in

[src/classes/filter.ts:36](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L36)

___

### order

• `Readonly` **order**: `Dictionary`<`any`\> = `{}`

#### Implementation of

[FilterInfo](../interfaces/layouts_filter.FilterInfo.md).[order](../interfaces/layouts_filter.FilterInfo.md#order)

#### Defined in

[src/classes/filter.ts:34](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L34)

___

### using

• `Readonly` **using**: `string`

Returns the parent schema table name for this filter

#### Implementation of

[FilterInfo](../interfaces/layouts_filter.FilterInfo.md).[using](../interfaces/layouts_filter.FilterInfo.md#using)

#### Defined in

[src/classes/filter.ts:38](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L38)

___

### where

• `Readonly` **where**: `Dictionary`<`any`\> = `{}`

#### Implementation of

[FilterInfo](../interfaces/layouts_filter.FilterInfo.md).[where](../interfaces/layouts_filter.FilterInfo.md#where)

#### Defined in

[src/classes/filter.ts:33](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L33)

___

### Group

▪ `Static` **Group**: typeof [`FilterGroup`](../enums/layouts_filter.FilterGroup.md) = `FilterGroup`

#### Defined in

[src/classes/filter.ts:28](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L28)

___

### LimitDefault

▪ `Static` **LimitDefault**: `number` = `100`

#### Defined in

[src/classes/filter.ts:23](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L23)

___

### LimitMaximum

▪ `Static` **LimitMaximum**: `number` = `10000`

#### Defined in

[src/classes/filter.ts:24](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L24)

___

### LimitMinimum

▪ `Static` **LimitMinimum**: `number` = `0`

#### Defined in

[src/classes/filter.ts:25](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L25)

___

### Order

▪ `Static` **Order**: typeof [`FilterOrder`](../enums/layouts_filter.FilterOrder.md) = `FilterOrder`

#### Defined in

[src/classes/filter.ts:29](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L29)

___

### Where

▪ `Static` **Where**: typeof [`FilterWhere`](../enums/layouts_filter.FilterWhere.md) = `FilterWhere`

#### Defined in

[src/classes/filter.ts:30](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L30)

## Methods

### toJSON

▸ **toJSON**(): [`FilterJson`](../interfaces/layouts_filter.FilterJson.md)

#### Returns

[`FilterJson`](../interfaces/layouts_filter.FilterJson.md)

#### Defined in

[src/classes/filter.ts:45](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/filter.ts#L45)
