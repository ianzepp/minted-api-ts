[minted-api](../README.md) / [Exports](../modules.md) / [classes/http-server](../modules/classes_http_server.md) / HttpServer

# Class: HttpServer

[classes/http-server](../modules/classes_http_server.md).HttpServer

## Table of contents

### Constructors

- [constructor](classes_http_server.HttpServer.md#constructor)

### Methods

- [listen](classes_http_server.HttpServer.md#listen)
- [run](classes_http_server.HttpServer.md#run)

## Constructors

### constructor

• **new HttpServer**()

## Methods

### listen

▸ **listen**(`port`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `port` | `number` |

#### Returns

`void`

#### Defined in

[src/classes/http-server.ts:28](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-server.ts#L28)

___

### run

▸ **run**(`req`, `res`): `Promise`<`ServerResponse`<`IncomingMessage`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `IncomingMessage` |
| `res` | `ServerResponse`<`IncomingMessage`\> |

#### Returns

`Promise`<`ServerResponse`<`IncomingMessage`\>\>

#### Defined in

[src/classes/http-server.ts:41](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/http-server.ts#L41)
