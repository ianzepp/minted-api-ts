[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-http](../modules/classes_system_http.md) / SystemHttp

# Class: SystemHttp

[classes/system-http](../modules/classes_system_http.md).SystemHttp

## Table of contents

### Constructors

- [constructor](classes_system_http.SystemHttp.md#constructor)

### Properties

- [\_\_system](classes_system_http.SystemHttp.md#__system)

### Methods

- [run](classes_system_http.SystemHttp.md#run)
- [startup](classes_system_http.SystemHttp.md#startup)

## Constructors

### constructor

• **new SystemHttp**(`__system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-http.ts:14](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-http.ts#L14)

## Properties

### \_\_system

• `Private` `Readonly` **\_\_system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-http.ts:14](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-http.ts#L14)

## Methods

### run

▸ **run**(`httpReq`, `httpRes`): `Promise`<[`HttpRes`](../interfaces/classes_http_server.HttpRes.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `httpReq` | [`HttpReq`](../interfaces/classes_http_server.HttpReq.md) |
| `httpRes` | [`HttpRes`](../interfaces/classes_http_server.HttpRes.md) |

#### Returns

`Promise`<[`HttpRes`](../interfaces/classes_http_server.HttpRes.md)\>

#### Defined in

[src/classes/system-http.ts:18](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-http.ts#L18)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-http.ts:16](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-http.ts#L16)
