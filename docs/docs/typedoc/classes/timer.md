---
id: "timer"
title: "Timer"
sidebar_label: "Timer"
---

[swapchain documentation](../globals.md) › [Timer](timer.md)

Handler to transform timelocks between blockchains.

## Hierarchy

* **Timer**

## Index

### Constructors

* [constructor](timer.md#constructor)

### Properties

* [bitcoinAPI](timer.md#private-bitcoinapi)
* [blockSequence](timer.md#private-blocksequence)

### Methods

* [toBTC](timer.md#tobtc)
* [toBTS](timer.md#tobts)

## Constructors

###  constructor

\+ **new Timer**(`blockSequence`: number, `network`: string, `BitcoinAPIConstructor`: [BitcoinAPIConstructor](../interfaces/bitcoinapiconstructor.md)): *[Timer](timer.md)*

*Defined in [pkg/accs/timer.ts:9](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/timer.ts#L9)*

Creates an instance of Timer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockSequence` | number | - |
`network` | string | - |
`BitcoinAPIConstructor` | [BitcoinAPIConstructor](../interfaces/bitcoinapiconstructor.md) |   |

**Returns:** *[Timer](timer.md)*

## Properties

### `Private` bitcoinAPI

• **bitcoinAPI**: *[BitcoinAPI](../interfaces/bitcoinapi.md)*

*Defined in [pkg/accs/timer.ts:8](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/timer.ts#L8)*

___

### `Private` blockSequence

• **blockSequence**: *number*

*Defined in [pkg/accs/timer.ts:9](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/timer.ts#L9)*

## Methods

###  toBTC

▸ **toBTC**(): *number*

*Defined in [pkg/accs/timer.ts:34](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/timer.ts#L34)*

Get Bitcoin timelock.

**Returns:** *number*

Bitcoin timelock in number of blocks.

___

###  toBTS

▸ **toBTS**(`blockHeightDifference`: number): *Promise‹number›*

*Defined in [pkg/accs/timer.ts:44](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/timer.ts#L44)*

Calculate Bitshares timelock based on bitcoin blockchain mining speed.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`blockHeightDifference` | number | 10 | The number of blocks to calculate mean. |

**Returns:** *Promise‹number›*

Bitshares timelock in seconds.
