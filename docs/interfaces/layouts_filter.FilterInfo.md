[minted-api](../README.md) / [Exports](../modules.md) / [layouts/filter](../modules/layouts_filter.md) / FilterInfo

# Interface: FilterInfo

[layouts/filter](../modules/layouts_filter.md).FilterInfo

Represents the architecture needed to obtain a filter's info.

## Hierarchy

- [`FilterJson`](layouts_filter.FilterJson.md)

  ↳ **`FilterInfo`**

## Implemented by

- [`Filter`](../classes/classes_filter.Filter.md)

## Table of contents

### Properties

- [flags](layouts_filter.FilterInfo.md#flags)
- [limit](layouts_filter.FilterInfo.md#limit)
- [order](layouts_filter.FilterInfo.md#order)
- [using](layouts_filter.FilterInfo.md#using)
- [where](layouts_filter.FilterInfo.md#where)

## Properties

### flags

• **flags**: `Dictionary`<`any`\>

#### Inherited from

[FilterJson](layouts_filter.FilterJson.md).[flags](layouts_filter.FilterJson.md#flags)

#### Defined in

[src/layouts/filter.ts:67](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/layouts/filter.ts#L67)

___

### limit

• **limit**: `number`

#### Inherited from

[FilterJson](layouts_filter.FilterJson.md).[limit](layouts_filter.FilterJson.md#limit)

#### Defined in

[src/layouts/filter.ts:68](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/layouts/filter.ts#L68)

___

### order

• **order**: `Dictionary`<`any`\>

#### Inherited from

[FilterJson](layouts_filter.FilterJson.md).[order](layouts_filter.FilterJson.md#order)

#### Defined in

[src/layouts/filter.ts:66](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/layouts/filter.ts#L66)

___

### using

• `Readonly` **using**: `string`

Returns the parent schema table name for this filter

#### Overrides

[FilterJson](layouts_filter.FilterJson.md).[using](layouts_filter.FilterJson.md#using)

#### Defined in

[src/layouts/filter.ts:83](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/layouts/filter.ts#L83)

___

### where

• **where**: `Dictionary`<`any`\>

#### Inherited from

[FilterJson](layouts_filter.FilterJson.md).[where](layouts_filter.FilterJson.md#where)

#### Defined in

[src/layouts/filter.ts:65](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/layouts/filter.ts#L65)
