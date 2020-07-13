---
id: "blockstream"
title: "BlockStream"
sidebar_label: "BlockStream"
---

[swapchain documentation](../globals.md) › [BlockStream](blockstream.md)

Handler to fetch and push data from the Blockstream API.

**`implements`** {BitcoinAPI}

## Hierarchy

* **BlockStream**

## Implements

* [BitcoinAPI](../interfaces/bitcoinapi.md)

## Index

### Constructors

* [constructor](blockstream.md#constructor)

### Properties

* [baseURL](blockstream.md#baseurl)

### Methods

* [getBlockHeight](blockstream.md#getblockheight)
* [getFeeEstimates](blockstream.md#getfeeestimates)
* [getLastBlock](blockstream.md#getlastblock)
* [getOutput](blockstream.md#getoutput)
* [getPreimageFromLastTransaction](blockstream.md#getpreimagefromlasttransaction)
* [getTimestampAtHeight](blockstream.md#gettimestampatheight)
* [getValueFromLastTransaction](blockstream.md#getvaluefromlasttransaction)
* [pushTX](blockstream.md#pushtx)

## Constructors

###  constructor

\+ **new BlockStream**(`network`: string): *[BlockStream](blockstream.md)*

*Defined in [pkg/bitcoin/api/blockstream.ts:11](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L11)*

Creates an instance of BlockStream.

**`memberof`** BlockStream

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`network` | string | The network type, either "testnet" or "mainnet". |

**Returns:** *[BlockStream](blockstream.md)*

## Properties

###  baseURL

• **baseURL**: *string*

*Defined in [pkg/bitcoin/api/blockstream.ts:11](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L11)*

## Methods

###  getBlockHeight

▸ **getBlockHeight**(`transactionID`: string): *Promise‹number | undefined›*

*Defined in [pkg/bitcoin/api/blockstream.ts:203](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L203)*

Return the block height of the transaction.

**`memberof`** BlockStream

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`transactionID` | string | ID of any bitcoin transaction. |

**Returns:** *Promise‹number | undefined›*

Blockheight or undefined if block is not mined/broadcasted yet.

___

###  getFeeEstimates

▸ **getFeeEstimates**(): *Promise‹number[]›*

*Defined in [pkg/bitcoin/api/blockstream.ts:218](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L218)*

Get fee estimates

**`memberof`** BlockStream

**Returns:** *Promise‹number[]›*

Array with fee estimates for high, mid and low priority in satoshis/vbyte. If fee estimates are too close, it returns only one or two values.

___

###  getLastBlock

▸ **getLastBlock**(): *Promise‹object›*

*Defined in [pkg/bitcoin/api/blockstream.ts:29](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L29)*

Get information of last block broadcasted

**`memberof`** BlockStream

**Returns:** *Promise‹object›*

Height and timestamp of the last block.

___

###  getOutput

▸ **getOutput**(`transactionID`: string, `address`: string): *Promise‹object›*

*Defined in [pkg/bitcoin/api/blockstream.ts:171](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L171)*

Return the vout and value of the transaction.

**`memberof`** BlockStream

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`transactionID` | string | ID of any bitcoin transaction. |
`address` | string | The address to look for. |

**Returns:** *Promise‹object›*

vout and value

___

###  getPreimageFromLastTransaction

▸ **getPreimageFromLastTransaction**(`address`: string): *Promise‹string›*

*Defined in [pkg/bitcoin/api/blockstream.ts:98](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L98)*

Return the Preimage of the last transacction.

**`memberof`** BlockStream

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The address to look for transactions. |

**Returns:** *Promise‹string›*

Preimage where address was found in vin.

___

###  getTimestampAtHeight

▸ **getTimestampAtHeight**(`blockHeight`: number): *Promise‹number›*

*Defined in [pkg/bitcoin/api/blockstream.ts:54](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L54)*

Get timestamp of block for given height

**`memberof`** BlockStream

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockHeight` | number | The desired block height. |

**Returns:** *Promise‹number›*

Timestamp of a block defined by its height.

___

###  getValueFromLastTransaction

▸ **getValueFromLastTransaction**(`address`: string): *Promise‹object›*

*Defined in [pkg/bitcoin/api/blockstream.ts:134](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L134)*

Get value and transaction id from last transaction

**`memberof`** BlockStream

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The address to look for transactions. |

**Returns:** *Promise‹object›*

Spendable value and the transaction id where the address occured in vout.

___

###  pushTX

▸ **pushTX**(`txHex`: string): *Promise‹string›*

*Defined in [pkg/bitcoin/api/blockstream.ts:78](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitcoin/api/blockstream.ts#L78)*

Push transaction to the bitcoin network

**`memberof`** BlockStream

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`txHex` | string | An encoded transaction in hex format. |

**Returns:** *Promise‹string›*

Transaction id on success or throws error on failure.
