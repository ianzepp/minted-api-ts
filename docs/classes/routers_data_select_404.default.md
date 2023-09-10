[minted-api](../README.md) / [Exports](../modules.md) / [routers/data-select-404](../modules/routers_data_select_404.md) / default

# Class: default

[routers/data-select-404](../modules/routers_data_select_404.md).default

## Hierarchy

- [`HttpRouter`](classes_http_router.HttpRouter.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](routers_data_select_404.default.md#constructor)

### Properties

- [Verb](routers_data_select_404.default.md#verb)

### Accessors

- [req](routers_data_select_404.default.md#req)
- [res](routers_data_select_404.default.md#res)
- [system](routers_data_select_404.default.md#system)

### Methods

- [is](routers_data_select_404.default.md#is)
- [isHttpPath](routers_data_select_404.default.md#ishttppath)
- [isHttpVerb](routers_data_select_404.default.md#ishttpverb)
- [onHttpPath](routers_data_select_404.default.md#onhttppath)
- [onHttpVerb](routers_data_select_404.default.md#onhttpverb)
- [run](routers_data_select_404.default.md#run)
- [runsafe](routers_data_select_404.default.md#runsafe)
- [toName](routers_data_select_404.default.md#toname)

## Constructors

### constructor

• **new default**()

#### Inherited from

[HttpRouter](classes_http_router.HttpRouter.md).[constructor](classes_http_router.HttpRouter.md#constructor)

## Properties

### Verb

▪ `Static` **Verb**: typeof [`HttpVerb`](../enums/classes_http_router.HttpVerb.md) = `HttpVerb`

#### Inherited from

[HttpRouter](classes_http_router.HttpRouter.md).[Verb](classes_http_router.HttpRouter.md#verb)

#### Defined in

[src/classes/http-router.ts:25](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-router.ts#L25)

## Accessors

### req

• `get` **req**(): [`HttpReq`](../interfaces/classes_http_req.HttpReq.md)

#### Returns

[`HttpReq`](../interfaces/classes_http_req.HttpReq.md)

#### Inherited from

HttpRouter.req

#### Defined in

[src/classes/http-router.ts:35](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-router.ts#L35)

___

### res

• `get` **res**(): [`HttpRes`](../interfaces/classes_http_res.HttpRes.md)

#### Returns

[`HttpRes`](../interfaces/classes_http_res.HttpRes.md)

#### Inherited from

HttpRouter.res

#### Defined in

[src/classes/http-router.ts:39](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-router.ts#L39)

___

### system

• `get` **system**(): [`System`](classes_system.System.md)

#### Returns

[`System`](classes_system.System.md)

#### Inherited from

HttpRouter.system

#### Defined in

[src/classes/http-router.ts:31](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-router.ts#L31)

## Methods

### is

▸ **is**(`verb`, `path`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `verb` | `string` |
| `path` | `string` |

#### Returns

`boolean`

#### Inherited from

[HttpRouter](classes_http_router.HttpRouter.md).[is](classes_http_router.HttpRouter.md#is)

#### Defined in

[src/classes/http-router.ts:101](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-router.ts#L101)

___

### isHttpPath

▸ **isHttpPath**(`path`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`boolean`

#### Inherited from

[HttpRouter](classes_http_router.HttpRouter.md).[isHttpPath](classes_http_router.HttpRouter.md#ishttppath)

#### Defined in

[src/classes/http-router.ts:97](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-router.ts#L97)

___

### isHttpVerb

▸ **isHttpVerb**(`verb`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `verb` | `string` |

#### Returns

`boolean`

#### Inherited from

[HttpRouter](classes_http_router.HttpRouter.md).[isHttpVerb](classes_http_router.HttpRouter.md#ishttpverb)

#### Defined in

[src/classes/http-router.ts:93](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-router.ts#L93)

___

### onHttpPath

▸ **onHttpPath**(): `string`

#### Returns

`string`

#### Overrides

[HttpRouter](classes_http_router.HttpRouter.md).[onHttpPath](classes_http_router.HttpRouter.md#onhttppath)

#### Defined in

[src/routers/data-select-404.ts:17](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/routers/data-select-404.ts#L17)

___

### onHttpVerb

▸ **onHttpVerb**(): [`HttpVerb`](../enums/classes_http_router.HttpVerb.md)

#### Returns

[`HttpVerb`](../enums/classes_http_router.HttpVerb.md)

#### Overrides

[HttpRouter](classes_http_router.HttpRouter.md).[onHttpVerb](classes_http_router.HttpRouter.md#onhttpverb)

#### Defined in

[src/routers/data-select-404.ts:13](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/routers/data-select-404.ts#L13)

___

### run

▸ **run**(): `Promise`<[`Record`](classes_record.Record.md)\>

#### Returns

`Promise`<[`Record`](classes_record.Record.md)\>

#### Overrides

[HttpRouter](classes_http_router.HttpRouter.md).[run](classes_http_router.HttpRouter.md#run)

#### Defined in

[src/routers/data-select-404.ts:9](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/routers/data-select-404.ts#L9)

___

### runsafe

▸ **runsafe**(`system`, `req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |
| `req` | [`HttpReq`](../interfaces/classes_http_req.HttpReq.md) |
| `res` | [`HttpRes`](../interfaces/classes_http_res.HttpRes.md) |

#### Returns

`Promise`<`any`\>

#### Inherited from

[HttpRouter](classes_http_router.HttpRouter.md).[runsafe](classes_http_router.HttpRouter.md#runsafe)

#### Defined in

[src/classes/http-router.ts:43](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-router.ts#L43)

___

### toName

▸ **toName**(): `string`

#### Returns

`string`

#### Inherited from

[HttpRouter](classes_http_router.HttpRouter.md).[toName](classes_http_router.HttpRouter.md#toname)

#### Defined in

[src/classes/http-router.ts:81](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-router.ts#L81)
