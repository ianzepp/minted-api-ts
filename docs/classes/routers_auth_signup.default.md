[minted-api](../README.md) / [Exports](../modules.md) / [routers/auth-signup](../modules/routers_auth_signup.md) / default

# Class: default

[routers/auth-signup](../modules/routers_auth_signup.md).default

## Hierarchy

- [`HttpRouter`](classes_http_router.HttpRouter.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](routers_auth_signup.default.md#constructor)

### Properties

- [Verb](routers_auth_signup.default.md#verb)

### Accessors

- [params](routers_auth_signup.default.md#params)
- [req](routers_auth_signup.default.md#req)
- [res](routers_auth_signup.default.md#res)
- [search](routers_auth_signup.default.md#search)
- [system](routers_auth_signup.default.md#system)

### Methods

- [is](routers_auth_signup.default.md#is)
- [isHttpPath](routers_auth_signup.default.md#ishttppath)
- [isHttpVerb](routers_auth_signup.default.md#ishttpverb)
- [onHttpPath](routers_auth_signup.default.md#onhttppath)
- [onHttpVerb](routers_auth_signup.default.md#onhttpverb)
- [run](routers_auth_signup.default.md#run)
- [runsafe](routers_auth_signup.default.md#runsafe)
- [toName](routers_auth_signup.default.md#toname)

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

[src/classes/http-router.ts:25](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L25)

## Accessors

### params

• `get` **params**(): `Dictionary`<`string`\>

#### Returns

`Dictionary`<`string`\>

#### Inherited from

HttpRouter.params

#### Defined in

[src/classes/http-router.ts:43](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L43)

___

### req

• `get` **req**(): [`HttpReq`](../interfaces/classes_http_req.HttpReq.md)

#### Returns

[`HttpReq`](../interfaces/classes_http_req.HttpReq.md)

#### Inherited from

HttpRouter.req

#### Defined in

[src/classes/http-router.ts:35](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L35)

___

### res

• `get` **res**(): [`HttpRes`](../interfaces/classes_http_res.HttpRes.md)

#### Returns

[`HttpRes`](../interfaces/classes_http_res.HttpRes.md)

#### Inherited from

HttpRouter.res

#### Defined in

[src/classes/http-router.ts:39](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L39)

___

### search

• `get` **search**(): `Dictionary`<`string`\>

#### Returns

`Dictionary`<`string`\>

#### Inherited from

HttpRouter.search

#### Defined in

[src/classes/http-router.ts:47](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L47)

___

### system

• `get` **system**(): [`System`](classes_system.System.md)

#### Returns

[`System`](classes_system.System.md)

#### Inherited from

HttpRouter.system

#### Defined in

[src/classes/http-router.ts:31](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L31)

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

[src/classes/http-router.ts:109](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L109)

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

[src/classes/http-router.ts:105](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L105)

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

[src/classes/http-router.ts:101](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L101)

___

### onHttpPath

▸ **onHttpPath**(): `string`

#### Returns

`string`

#### Overrides

[HttpRouter](classes_http_router.HttpRouter.md).[onHttpPath](classes_http_router.HttpRouter.md#onhttppath)

#### Defined in

[src/routers/auth-signup.ts:16](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/routers/auth-signup.ts#L16)

___

### onHttpVerb

▸ **onHttpVerb**(): [`HttpVerb`](../enums/classes_http_router.HttpVerb.md)

#### Returns

[`HttpVerb`](../enums/classes_http_router.HttpVerb.md)

#### Overrides

[HttpRouter](classes_http_router.HttpRouter.md).[onHttpVerb](classes_http_router.HttpRouter.md#onhttpverb)

#### Defined in

[src/routers/auth-signup.ts:12](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/routers/auth-signup.ts#L12)

___

### run

▸ **run**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[HttpRouter](classes_http_router.HttpRouter.md).[run](classes_http_router.HttpRouter.md#run)

#### Defined in

[src/routers/auth-signup.ts:8](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/routers/auth-signup.ts#L8)

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

[src/classes/http-router.ts:51](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L51)

___

### toName

▸ **toName**(): `string`

#### Returns

`string`

#### Inherited from

[HttpRouter](classes_http_router.HttpRouter.md).[toName](classes_http_router.HttpRouter.md#toname)

#### Defined in

[src/classes/http-router.ts:89](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/http-router.ts#L89)
