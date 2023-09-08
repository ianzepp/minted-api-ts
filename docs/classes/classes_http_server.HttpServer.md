[minted-api](../README.md) / [Exports](../modules.md) / [classes/http-server](../modules/classes_http_server.md) / HttpServer

# Class: HttpServer

[classes/http-server](../modules/classes_http_server.md).HttpServer

## Table of contents

### Constructors

- [constructor](classes_http_server.HttpServer.md#constructor)

### Properties

- [\_\_routes](classes_http_server.HttpServer.md#__routes)

### Methods

- [listen](classes_http_server.HttpServer.md#listen)
- [run](classes_http_server.HttpServer.md#run)

## Constructors

### constructor

• **new HttpServer**()

## Properties

### \_\_routes

• `Private` `Readonly` **\_\_routes**: [`HttpServerRoute`](../interfaces/classes_http_server.HttpServerRoute.md)[] = `[]`

#### Defined in

[src/classes/http-server.ts:52](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-server.ts#L52)

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

[src/classes/http-server.ts:55](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-server.ts#L55)

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

[src/classes/http-server.ts:68](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/http-server.ts#L68)
