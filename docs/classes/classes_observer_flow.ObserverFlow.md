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

- [change\_data](classes_observer_flow.ObserverFlow.md#change_data)
- [change\_meta](classes_observer_flow.ObserverFlow.md#change_meta)

### Methods

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

[src/classes/observer-flow.ts:28](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L28)

## Properties

### change

• `Readonly` **change**: [`Record`](classes_record.Record.md)[]

#### Defined in

[src/classes/observer-flow.ts:31](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L31)

___

### expect

• `Readonly` **expect**: `ExpectStatic` = `chai.expect`

#### Defined in

[src/classes/observer-flow.ts:25](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L25)

___

### failures

• `Readonly` **failures**: [`ObserverFlowFailure`](../interfaces/layouts_observer.ObserverFlowFailure.md)[] = `[]`

#### Defined in

[src/classes/observer-flow.ts:26](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L26)

___

### filter

• `Readonly` **filter**: [`Filter`](classes_filter.Filter.md)

#### Defined in

[src/classes/observer-flow.ts:32](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L32)

___

### op

• `Readonly` **op**: `string`

#### Defined in

[src/classes/observer-flow.ts:33](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L33)

___

### schema

• `Readonly` **schema**: [`Schema`](classes_schema.Schema.md)

#### Defined in

[src/classes/observer-flow.ts:30](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L30)

___

### system

• `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/observer-flow.ts:29](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L29)

## Accessors

### change\_data

• `get` **change_data**(): `Dictionary`<`any`\>[]

#### Returns

`Dictionary`<`any`\>[]

#### Defined in

[src/classes/observer-flow.ts:35](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L35)

___

### change\_meta

• `get` **change_meta**(): `Dictionary`<`any`\>[]

#### Returns

`Dictionary`<`any`\>[]

#### Defined in

[src/classes/observer-flow.ts:39](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L39)

## Methods

### run

▸ **run**(`ring`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ring` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/observer-flow.ts:43](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/observer-flow.ts#L43)
