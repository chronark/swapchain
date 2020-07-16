---
id: "blockstream"
title: "BlockStream"
sidebar_label: "BlockStream"
---

[swapchain documentation](../globals.md) › [BlockStream](blockstream.md)

Handler to fetch and push data from the Blockstream API.

**`implements`** {BitcoinAPI}

## Hierarchy

- **BlockStream**

## Implements

- [BitcoinAPI](../interfaces/bitcoinapi.md)

## Index

### Constructors

- [constructor](blockstream.md#constructor)

### Properties

- [baseURL](blockstream.md#baseurl)

### Methods

- [getBlockHeight](blockstream.md#getblockheight)
- [getFeeEstimates](blockstream.md#getfeeestimates)
- [getLastBlock](blockstream.md#getlastblock)
- [getOutput](blockstream.md#getoutput)
- [getPreimageFromLastTransaction](blockstream.md#getpreimagefromlasttransaction)
- [getTimestampAtHeight](blockstream.md#gettimestampatheight)
- [getValueFromLastTransaction](blockstream.md#getvaluefromlasttransaction)
- [pushTX](blockstream.md#pushtx)

## Constructors

### constructor

\+ **new BlockStream**(`network`: string): _[BlockStream](blockstream.md)_

_Defined in [pkg/bitcoin/api/blockstream.ts:11](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L11)_

Creates an instance of BlockStream.

**`memberof`** BlockStream

**Parameters:**

| Name      | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| `network` | string | The network type, either "testnet" or "mainnet". |

**Returns:** _[BlockStream](blockstream.md)_

## Properties

### baseURL

• **baseURL**: _string_

_Defined in [pkg/bitcoin/api/blockstream.ts:11](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L11)_

## Methods

### getBlockHeight

▸ **getBlockHeight**(`transactionID`: string): _Promise‹number | undefined›_

_Defined in [pkg/bitcoin/api/blockstream.ts:207](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L207)_

Return the block height of the transaction.

**`memberof`** BlockStream

**Parameters:**

| Name            | Type   | Description                    |
| --------------- | ------ | ------------------------------ |
| `transactionID` | string | ID of any bitcoin transaction. |

**Returns:** _Promise‹number | undefined›_

Blockheight or undefined if block is not mined/broadcasted yet.

---

### getFeeEstimates

▸ **getFeeEstimates**(): _Promise‹number[]›_

_Defined in [pkg/bitcoin/api/blockstream.ts:222](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L222)_

Get fee estimates

**`memberof`** BlockStream

**Returns:** _Promise‹number[]›_

Array with fee estimates for high, mid and low priority in satoshis/vbyte. If fee estimates are too close, it returns only one or two values.

---

### getLastBlock

▸ **getLastBlock**(): _Promise‹object›_

_Defined in [pkg/bitcoin/api/blockstream.ts:29](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L29)_

Get information of last block broadcasted

**`memberof`** BlockStream

**Returns:** _Promise‹object›_

Height and timestamp of the last block.

---

### getOutput

▸ **getOutput**(`transactionID`: string, `address`: string): _Promise‹object›_

_Defined in [pkg/bitcoin/api/blockstream.ts:175](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L175)_

Return the vout and value of the transaction.

**`memberof`** BlockStream

**Parameters:**

| Name            | Type   | Description                    |
| --------------- | ------ | ------------------------------ |
| `transactionID` | string | ID of any bitcoin transaction. |
| `address`       | string | The address to look for.       |

**Returns:** _Promise‹object›_

vout and value

---

### getPreimageFromLastTransaction

▸ **getPreimageFromLastTransaction**(`address`: string): _Promise‹string›_

_Defined in [pkg/bitcoin/api/blockstream.ts:98](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L98)_

Return the Preimage of the last transacction.

**`memberof`** BlockStream

**Parameters:**

| Name      | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| `address` | string | The address to look for transactions. |

**Returns:** _Promise‹string›_

Preimage where address was found in vin.

---

### getTimestampAtHeight

▸ **getTimestampAtHeight**(`blockHeight`: number): _Promise‹number›_

_Defined in [pkg/bitcoin/api/blockstream.ts:54](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L54)_

Get timestamp of block for given height

**`memberof`** BlockStream

**Parameters:**

| Name          | Type   | Description               |
| ------------- | ------ | ------------------------- |
| `blockHeight` | number | The desired block height. |

**Returns:** _Promise‹number›_

Timestamp of a block defined by its height.

---

### getValueFromLastTransaction

▸ **getValueFromLastTransaction**(`address`: string): _Promise‹object›_

_Defined in [pkg/bitcoin/api/blockstream.ts:135](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L135)_

Get value and transaction id from last transaction

**`memberof`** BlockStream

**Parameters:**

| Name      | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| `address` | string | The address to look for transactions. |

**Returns:** _Promise‹object›_

Spendable value and the transaction id where the address occured in vout.

---

### pushTX

▸ **pushTX**(`txHex`: string): _Promise‹string›_

_Defined in [pkg/bitcoin/api/blockstream.ts:78](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/api/blockstream.ts#L78)_

Push transaction to the bitcoin network

**`memberof`** BlockStream

**Parameters:**

| Name    | Type   | Description                           |
| ------- | ------ | ------------------------------------- |
| `txHex` | string | An encoded transaction in hex format. |

**Returns:** _Promise‹string›_

Transaction id on success or throws error on failure.
