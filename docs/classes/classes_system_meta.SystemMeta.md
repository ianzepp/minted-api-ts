[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-meta](../modules/classes_system_meta.md) / SystemMeta

# Class: SystemMeta

[classes/system-meta](../modules/classes_system_meta.md).SystemMeta

## Implements

- [`SystemService`](../interfaces/classes_system.SystemService.md)

## Table of contents

### Constructors

- [constructor](classes_system_meta.SystemMeta.md#constructor)

### Properties

- [schemas](classes_system_meta.SystemMeta.md#schemas)
- [system](classes_system_meta.SystemMeta.md#system)

### Methods

- [cleanup](classes_system_meta.SystemMeta.md#cleanup)
- [isSchema](classes_system_meta.SystemMeta.md#isschema)
- [refresh](classes_system_meta.SystemMeta.md#refresh)
- [select](classes_system_meta.SystemMeta.md#select)
- [startup](classes_system_meta.SystemMeta.md#startup)
- [toFilter](classes_system_meta.SystemMeta.md#tofilter)
- [toSchema](classes_system_meta.SystemMeta.md#toschema)

## Constructors

### constructor

• **new SystemMeta**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-meta.ts:23](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L23)

## Properties

### schemas

• `Readonly` **schemas**: `Dictionary`<[`Schema`](classes_schema.Schema.md)\> = `{}`

#### Defined in

[src/classes/system-meta.ts:21](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L21)

___

### system

• `Private` `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-meta.ts:23](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L23)

## Methods

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[cleanup](../interfaces/classes_system.SystemService.md#cleanup)

#### Defined in

[src/classes/system-meta.ts:42](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L42)

___

### isSchema

▸ **isSchema**(`schema_name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |

#### Returns

`boolean`

#### Defined in

[src/classes/system-meta.ts:62](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L62)

___

### refresh

▸ **refresh**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-meta.ts:48](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L48)

___

### select

▸ `Private` **select**(`schema_name`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[src/classes/system-meta.ts:53](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L53)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[startup](../interfaces/classes_system.SystemService.md#startup)

#### Defined in

[src/classes/system-meta.ts:25](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L25)

___

### toFilter

▸ **toFilter**(`schema_name`, `filter_data`): [`Filter`](classes_filter.Filter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Dictionary`<`any`\> |

#### Returns

[`Filter`](classes_filter.Filter.md)

#### Defined in

[src/classes/system-meta.ts:84](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L84)

___

### toSchema

▸ **toSchema**(`schema_name`): [`Schema`](classes_schema.Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |

#### Returns

[`Schema`](classes_schema.Schema.md)

#### Defined in

[src/classes/system-meta.ts:66](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/system-meta.ts#L66)
