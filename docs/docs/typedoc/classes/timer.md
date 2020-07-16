---
id: "timer"
title: "Timer"
sidebar_label: "Timer"
---

[swapchain documentation](../globals.md) › [Timer](timer.md)

Handler to transform timelocks between blockchains.

## Hierarchy

- **Timer**

## Index

### Constructors

- [constructor](timer.md#constructor)

### Properties

- [bitcoinAPI](timer.md#private-bitcoinapi)
- [blockSequence](timer.md#private-blocksequence)

### Methods

- [toBTC](timer.md#tobtc)
- [toBTS](timer.md#tobts)

## Constructors

### constructor

\+ **new Timer**(`blockSequence`: number, `network`: string, `BitcoinAPIConstructor`: [BitcoinAPIConstructor](../interfaces/bitcoinapiconstructor.md)): _[Timer](timer.md)_

_Defined in [pkg/accs/timer.ts:9](https://github.com/chronark/swapchain/blob/9502eb6/src/pkg/accs/timer.ts#L9)_

Creates an instance of Timer

**Parameters:**

| Name                    | Type                                                            | Description |
| ----------------------- | --------------------------------------------------------------- | ----------- |
| `blockSequence`         | number                                                          | -           |
| `network`               | string                                                          | -           |
| `BitcoinAPIConstructor` | [BitcoinAPIConstructor](../interfaces/bitcoinapiconstructor.md) |             |

**Returns:** _[Timer](timer.md)_

## Properties

### `Private` bitcoinAPI

• **bitcoinAPI**: _[BitcoinAPI](../interfaces/bitcoinapi.md)_

_Defined in [pkg/accs/timer.ts:8](https://github.com/chronark/swapchain/blob/9502eb6/src/pkg/accs/timer.ts#L8)_

---

### `Private` blockSequence

• **blockSequence**: _number_

_Defined in [pkg/accs/timer.ts:9](https://github.com/chronark/swapchain/blob/9502eb6/src/pkg/accs/timer.ts#L9)_

## Methods

### toBTC

▸ **toBTC**(): _number_

_Defined in [pkg/accs/timer.ts:34](https://github.com/chronark/swapchain/blob/9502eb6/src/pkg/accs/timer.ts#L34)_

Get Bitcoin timelock.

**Returns:** _number_

Bitcoin timelock in number of blocks.

---

### toBTS

▸ **toBTS**(`blockHeightDifference`: number): _Promise‹number›_

_Defined in [pkg/accs/timer.ts:44](https://github.com/chronark/swapchain/blob/9502eb6/src/pkg/accs/timer.ts#L44)_

Calculate Bitshares timelock based on bitcoin blockchain mining speed.

**Parameters:**

| Name                    | Type   | Default | Description                             |
| ----------------------- | ------ | ------- | --------------------------------------- |
| `blockHeightDifference` | number | 10      | The number of blocks to calculate mean. |

**Returns:** _Promise‹number›_

Bitshares timelock in seconds.
