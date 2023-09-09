[minted-api](../README.md) / [Exports](../modules.md) / [classes/observer-flow](../modules/classes_observer_flow.md) / ObserverFlow

# Class: ObserverFlow

[classes/observer-flow](../modules/classes_observer_flow.md).ObserverFlow

## Table of contents

### Constructors

- [constructor](classes_observer_flow.ObserverFlow.md#constructor)

### Properties

- [change](classes_observer_flow.ObserverFlow.md#change)
- [expect](classes_observer_flow.ObserverFlow.md#expect)
- [failures](classes_observer_flow.ObserverFlow.md#failures)
- [filter](classes_observer_flow.ObserverFlow.md#filter)
- [op](classes_observer_flow.ObserverFlow.md#op)
- [schema](classes_observer_flow.ObserverFlow.md#schema)
- [system](classes_observer_flow.ObserverFlow.md#system)

### Accessors

- [change\_ids](classes_observer_flow.ObserverFlow.md#change_ids)
- [change\_map](classes_observer_flow.ObserverFlow.md#change_map)

### Methods

- [fail](classes_observer_flow.ObserverFlow.md#fail)
- [run](classes_observer_flow.ObserverFlow.md#run)

## Constructors

### constructor

• **new ObserverFlow**(`system`, `schema`, `change`, `filter`, `op`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |
| `schema` | [`Schema`](classes_schema.Schema.md) |
| `change` | [`Record`](classes_record.Record.md)[] |
| `filter` | [`Filter`](classes_filter.Filter.md) |
| `op` | `string` |

#### Defined in

[src/classes/observer-flow.ts:26](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L26)

## Properties

### change

• `Readonly` **change**: [`Record`](classes_record.Record.md)[]

#### Defined in

[src/classes/observer-flow.ts:29](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L29)

___

### expect

• `Readonly` **expect**: `ExpectStatic` = `chai.expect`

#### Defined in

[src/classes/observer-flow.ts:23](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L23)

___

### failures

• `Readonly` **failures**: [`ObserverFlowFailure`](../interfaces/layouts_observer.ObserverFlowFailure.md)[] = `[]`

#### Defined in

[src/classes/observer-flow.ts:24](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L24)

___

### filter

• `Readonly` **filter**: [`Filter`](classes_filter.Filter.md)

#### Defined in

[src/classes/observer-flow.ts:30](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L30)

___

### op

• `Readonly` **op**: `string`

#### Defined in

[src/classes/observer-flow.ts:31](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L31)

___

### schema

• `Readonly` **schema**: [`Schema`](classes_schema.Schema.md)

#### Defined in

[src/classes/observer-flow.ts:28](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L28)

___

### system

• `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/observer-flow.ts:27](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L27)

## Accessors

### change\_ids

• `get` **change_ids**(): `any`[]

#### Returns

`any`[]

#### Defined in

[src/classes/observer-flow.ts:37](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L37)

___

### change\_map

• `get` **change_map**(): `Dictionary`<[`Record`](classes_record.Record.md)\>

#### Returns

`Dictionary`<[`Record`](classes_record.Record.md)\>

#### Defined in

[src/classes/observer-flow.ts:33](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L33)

## Methods

### fail

▸ **fail**(`code`, `message`, `record?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `message` | `string` |
| `record?` | [`Record`](classes_record.Record.md) |

#### Returns

`void`

#### Defined in

[src/classes/observer-flow.ts:115](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L115)

___

### run

▸ **run**(`ring`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ring` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/observer-flow.ts:41](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/classes/observer-flow.ts#L41)
