---
id: "timer"
title: "Timer"
sidebar_label: "Timer"
---

[swapchain documentation](../index.md) › [Globals](../globals.md) › [Timer](timer.md)

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

Defined in accs/timer.ts:8

Creates an instance of Timer.

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

Defined in accs/timer.ts:7

---

### `Private` blockSequence

• **blockSequence**: _number_

Defined in accs/timer.ts:8

## Methods

### toBTC

▸ **toBTC**(): _number_

Defined in accs/timer.ts:33

Get Bitcoin timelock.

**Returns:** _number_

Bitcoin timelock in number of blocks.

---

### toBTS

▸ **toBTS**(`blockHeightDifference`: number): _Promise‹number›_

Defined in accs/timer.ts:43

Calculate Bitshares timelock based on bitcoin blockchain mining speed.

**Parameters:**

| Name                    | Type   | Default | Description                             |
| ----------------------- | ------ | ------- | --------------------------------------- |
| `blockHeightDifference` | number | 10      | The number of blocks to calculate mean. |

**Returns:** _Promise‹number›_

Bitshares timelock in seconds.
