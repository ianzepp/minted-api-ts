[minted-api](../README.md) / [Exports](../modules.md) / [classes/http-router](../modules/classes_http_router.md) / HttpRouter

# Class: HttpRouter

[classes/http-router](../modules/classes_http_router.md).HttpRouter

## Hierarchy

- **`HttpRouter`**

  ↳ [`default`](routers_data_create_all.default.md)

  ↳ [`default`](routers_data_delete_all.default.md)

  ↳ [`default`](routers_data_delete_ids.default.md)

  ↳ [`default`](routers_data_select_404.default.md)

  ↳ [`default`](routers_data_select_any.default.md)

  ↳ [`default`](routers_data_update_all.default.md)

  ↳ [`default`](routers_data_update_one.default.md)

  ↳ [`default`](routers_data_upsert_all.default.md)

  ↳ [`default`](routers_meta_export.default.md)

  ↳ [`default`](routers_meta_import.default.md)

  ↳ [`default`](routers_ping.default.md)

  ↳ [`default`](routers_test_any.default.md)

## Table of contents

### Constructors

- [constructor](classes_http_router.HttpRouter.md#constructor)

### Properties

- [\_\_req](classes_http_router.HttpRouter.md#__req)
- [\_\_res](classes_http_router.HttpRouter.md#__res)
- [\_\_system](classes_http_router.HttpRouter.md#__system)
- [Verb](classes_http_router.HttpRouter.md#verb)

### Accessors

- [req](classes_http_router.HttpRouter.md#req)
- [res](classes_http_router.HttpRouter.md#res)
- [system](classes_http_router.HttpRouter.md#system)

### Methods

- [is](classes_http_router.HttpRouter.md#is)
- [isHttpPath](classes_http_router.HttpRouter.md#ishttppath)
- [isHttpVerb](classes_http_router.HttpRouter.md#ishttpverb)
- [onHttpPath](classes_http_router.HttpRouter.md#onhttppath)
- [onHttpVerb](classes_http_router.HttpRouter.md#onhttpverb)
- [run](classes_http_router.HttpRouter.md#run)
- [runsafe](classes_http_router.HttpRouter.md#runsafe)
- [toName](classes_http_router.HttpRouter.md#toname)

## Constructors

### constructor

• **new HttpRouter**()

## Properties

### \_\_req

• `Private` **\_\_req**: [`HttpReq`](../interfaces/classes_http_server.HttpReq.md)

#### Defined in

[src/classes/http-router.ts:28](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L28)

___

### \_\_res

• `Private` **\_\_res**: [`HttpRes`](../interfaces/classes_http_server.HttpRes.md)

#### Defined in

[src/classes/http-router.ts:29](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L29)

___

### \_\_system

• `Private` **\_\_system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/http-router.ts:27](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L27)

___

### Verb

▪ `Static` **Verb**: typeof [`HttpVerb`](../enums/classes_http_router.HttpVerb.md) = `HttpVerb`

#### Defined in

[src/classes/http-router.ts:25](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L25)

## Accessors

### req

• `get` **req**(): [`HttpReq`](../interfaces/classes_http_server.HttpReq.md)

#### Returns

[`HttpReq`](../interfaces/classes_http_server.HttpReq.md)

#### Defined in

[src/classes/http-router.ts:35](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L35)

___

### res

• `get` **res**(): [`HttpRes`](../interfaces/classes_http_server.HttpRes.md)

#### Returns

[`HttpRes`](../interfaces/classes_http_server.HttpRes.md)

#### Defined in

[src/classes/http-router.ts:39](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L39)

___

### system

• `get` **system**(): [`System`](classes_system.System.md)

#### Returns

[`System`](classes_system.System.md)

#### Defined in

[src/classes/http-router.ts:31](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L31)

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

#### Defined in

[src/classes/http-router.ts:101](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L101)

___

### isHttpPath

▸ **isHttpPath**(`path`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`boolean`

#### Defined in

[src/classes/http-router.ts:97](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L97)

___

### isHttpVerb

▸ **isHttpVerb**(`verb`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `verb` | `string` |

#### Returns

`boolean`

#### Defined in

[src/classes/http-router.ts:93](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L93)

___

### onHttpPath

▸ **onHttpPath**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/http-router.ts:89](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L89)

___

### onHttpVerb

▸ **onHttpVerb**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/http-router.ts:85](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L85)

___

### run

▸ **run**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[src/classes/http-router.ts:77](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L77)

___

### runsafe

▸ **runsafe**(`system`, `req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |
| `req` | [`HttpReq`](../interfaces/classes_http_server.HttpReq.md) |
| `res` | [`HttpRes`](../interfaces/classes_http_server.HttpRes.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/classes/http-router.ts:43](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L43)

___

### toName

▸ **toName**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/http-router.ts:81](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-router.ts#L81)
