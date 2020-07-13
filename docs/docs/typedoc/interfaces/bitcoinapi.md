---
id: "bitcoinapi"
title: "BitcoinAPI"
sidebar_label: "BitcoinAPI"
---

[swapchain documentation](../globals.md) › [BitcoinAPI](bitcoinapi.md)

This interface defines the data required for the HTLC creation on the bitcoin blockchain.
You are welcome to implement this yourself and pass it to the HTLC class.

The return objects are explicitly stated here as these are the only values we require.
Anything else returned from your api of choice can be ignored.

**`interface`** BitcoinAPI

## Hierarchy

* **BitcoinAPI**

## Implemented by

* [BlockStream](../classes/blockstream.md)

## Index

### Properties

* [getBlockHeight](bitcoinapi.md#getblockheight)
* [getFeeEstimates](bitcoinapi.md#getfeeestimates)
* [getLastBlock](bitcoinapi.md#getlastblock)
* [getOutput](bitcoinapi.md#getoutput)
* [getPreimageFromLastTransaction](bitcoinapi.md#getpreimagefromlasttransaction)
* [getTimestampAtHeight](bitcoinapi.md#gettimestampatheight)
* [getValueFromLastTransaction](bitcoinapi.md#getvaluefromlasttransaction)
* [pushTX](bitcoinapi.md#pushtx)

## Properties

###  getBlockHeight

• **getBlockHeight**: *function*

*Defined in [pkg/types/bitcoinApi.ts:67](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/types/bitcoinApi.ts#L67)*

Return the blockheight of a transaction.

**`param`** ID of any bitcoin transaction.

**`returns`** Blockheight or undefined if block is not mined/broadcasted yet.

#### Type declaration:

▸ (`transactionID`: string): *Promise‹number | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`transactionID` | string |

___

###  getFeeEstimates

• **getFeeEstimates**: *function*

*Defined in [pkg/types/bitcoinApi.ts:75](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/types/bitcoinApi.ts#L75)*

Get fee estimates

**`returns`** Array with fee estimates for high, mid and low priority in satoshis/vbyte. If fee estimates are too close, it returns only one or two values.

**`memberof`** BlockStream

#### Type declaration:

▸ (): *Promise‹number[]›*

___

###  getLastBlock

• **getLastBlock**: *function*

*Defined in [pkg/types/bitcoinApi.ts:22](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/types/bitcoinApi.ts#L22)*

Return height and timestamp of the last block.
Used for timelock calculations.

#### Type declaration:

▸ (): *Promise‹object›*

___

###  getOutput

• **getOutput**: *function*

*Defined in [pkg/types/bitcoinApi.ts:59](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/types/bitcoinApi.ts#L59)*

Return the vout and value of the transaction.

**`param`** ID of any bitcoin transaction.

**`param`** The address to look for.

**`returns`** vout and value

#### Type declaration:

▸ (`transactionID`: string, `address`: string): *Promise‹object›*

**Parameters:**

Name | Type |
------ | ------ |
`transactionID` | string |
`address` | string |

___

###  getPreimageFromLastTransaction

• **getPreimageFromLastTransaction**: *function*

*Defined in [pkg/types/bitcoinApi.ts:43](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/types/bitcoinApi.ts#L43)*

Returns the preimage of the last incoming transaction.

**`param`** Any bitcoin address.

**`returns`** Returns the preimage of the last incoming transaction.

#### Type declaration:

▸ (`address`: string): *Promise‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

___

###  getTimestampAtHeight

• **getTimestampAtHeight**: *function*

*Defined in [pkg/types/bitcoinApi.ts:28](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/types/bitcoinApi.ts#L28)*

Return the timestamp of a block defined by its height.
Used for timelock calculations

#### Type declaration:

▸ (`n`: number): *Promise‹number›*

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

___

###  getValueFromLastTransaction

• **getValueFromLastTransaction**: *function*

*Defined in [pkg/types/bitcoinApi.ts:50](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/types/bitcoinApi.ts#L50)*

Returns the outgoing transaction of an address.

**`param`** Any bitcoin address.

**`returns`** Amount of the transaction and its ID.

#### Type declaration:

▸ (`address`: string): *Promise‹object›*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

___

###  pushTX

• **pushTX**: *function*

*Defined in [pkg/types/bitcoinApi.ts:35](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/types/bitcoinApi.ts#L35)*

Pushes a transaction hex to the blockchain.
Returns the transactionID on success.
Throws on failure

#### Type declaration:

▸ (`transactionHex`: string): *Promise‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`transactionHex` | string |
