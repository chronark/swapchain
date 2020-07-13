---
id: "accs"
title: "ACCS"
sidebar_label: "ACCS"
---

[swapchain documentation](../globals.md) › [ACCS](accs.md)

Handler to create HTLCs on the respective blockchains to run an ACCS.

## Hierarchy

* **ACCS**

## Index

### Methods

* [parseUserInput](accs.md#static-parseuserinput)
* [proposeBTCForBTS](accs.md#static-proposebtcforbts)
* [proposeBTSForBTC](accs.md#static-proposebtsforbtc)
* [run](accs.md#static-run)
* [takeBTCForBTS](accs.md#static-takebtcforbts)
* [takeBTSForBTC](accs.md#static-takebtsforbtc)

## Methods

### `Static` parseUserInput

▸ **parseUserInput**(`fields`: [ACCSFields](../interfaces/accsfields.md)): *Promise‹[ACCSConfig](../interfaces/accsconfig.md)›*

*Defined in [accs/accs.ts:185](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L185)*

Parse user input to create config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fields` | [ACCSFields](../interfaces/accsfields.md) |   |

**Returns:** *Promise‹[ACCSConfig](../interfaces/accsconfig.md)›*

___

### `Static` proposeBTCForBTS

▸ **proposeBTCForBTS**(`config`: [ACCSConfig](../interfaces/accsconfig.md)): *Promise‹void›*

*Defined in [accs/accs.ts:306](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L306)*

Handles ACCS for proposer who wants BTC for BTS.

**`memberof`** ACCS

**Parameters:**

Name | Type |
------ | ------ |
`config` | [ACCSConfig](../interfaces/accsconfig.md) |

**Returns:** *Promise‹void›*

___

### `Static` proposeBTSForBTC

▸ **proposeBTSForBTC**(`config`: [ACCSConfig](../interfaces/accsconfig.md)): *Promise‹void›*

*Defined in [accs/accs.ts:245](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L245)*

Handles ACCS for proposer who wants BTS for BTC.

**`memberof`** ACCS

**Parameters:**

Name | Type |
------ | ------ |
`config` | [ACCSConfig](../interfaces/accsconfig.md) |

**Returns:** *Promise‹void›*

___

### `Static` run

▸ **run**(`fields`: [ACCSFields](../interfaces/accsfields.md)): *Promise‹void›*

*Defined in [accs/accs.ts:570](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L570)*

Entrypoint for web app and CLI. Calls respective parse and swap methods.

**`memberof`** ACCS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fields` | [ACCSFields](../interfaces/accsfields.md) | The raw user input object. |

**Returns:** *Promise‹void›*

___

### `Static` takeBTCForBTS

▸ **takeBTCForBTS**(`config`: [ACCSConfig](../interfaces/accsconfig.md)): *Promise‹void›*

*Defined in [accs/accs.ts:469](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L469)*

Handles ACCS for accepter who wants BTC for BTS.

**`memberof`** ACCS

**Parameters:**

Name | Type |
------ | ------ |
`config` | [ACCSConfig](../interfaces/accsconfig.md) |

**Returns:** *Promise‹void›*

___

### `Static` takeBTSForBTC

▸ **takeBTSForBTC**(`config`: [ACCSConfig](../interfaces/accsconfig.md)): *Promise‹void›*

*Defined in [accs/accs.ts:372](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L372)*

Handles ACCS for accepter who wants BTS for BTC.

**`memberof`** ACCS

**Parameters:**

Name | Type |
------ | ------ |
`config` | [ACCSConfig](../interfaces/accsconfig.md) |

**Returns:** *Promise‹void›*
