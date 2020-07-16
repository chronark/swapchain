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

*Defined in [pkg/accs/accs.ts:200](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L200)*

Parse user input to create config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fields` | [ACCSFields](../interfaces/accsfields.md) |   |

**Returns:** *Promise‹[ACCSConfig](../interfaces/accsconfig.md)›*

___

### `Static` proposeBTCForBTS

▸ **proposeBTCForBTS**(`config`: [ACCSConfig](../interfaces/accsconfig.md)): *Promise‹void›*

*Defined in [pkg/accs/accs.ts:323](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L323)*

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

*Defined in [pkg/accs/accs.ts:262](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L262)*

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

*Defined in [pkg/accs/accs.ts:610](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L610)*

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

*Defined in [pkg/accs/accs.ts:490](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L490)*

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

*Defined in [pkg/accs/accs.ts:389](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L389)*

Handles ACCS for accepter who wants BTS for BTC.

**`memberof`** ACCS

**Parameters:**

Name | Type |
------ | ------ |
`config` | [ACCSConfig](../interfaces/accsconfig.md) |

**Returns:** *Promise‹void›*
