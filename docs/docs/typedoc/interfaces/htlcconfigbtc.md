---
id: "htlcconfigbtc"
title: "HTLCConfigBTC"
sidebar_label: "HTLCConfigBTC"
---

[swapchain documentation](../globals.md) › [HTLCConfigBTC](htlcconfigbtc.md)

Contains all necessary information to create an HTLC on Bitcoin blockchain

**`interface`** HTLCConfigBTC

## Hierarchy

* **HTLCConfigBTC**

## Index

### Properties

* [amount](htlcconfigbtc.md#amount)
* [hash](htlcconfigbtc.md#hash)
* [sequence](htlcconfigbtc.md#sequence)
* [transactionID](htlcconfigbtc.md#transactionid)

## Properties

###  amount

• **amount**: *number*

*Defined in [pkg/bitcoin/htlc/btcHTLC.ts:26](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/htlc/btcHTLC.ts#L26)*

The amount of satoshi to exchange.

**`memberof`** HTLCConfigBTC

___

###  hash

• **hash**: *Buffer*

*Defined in [pkg/bitcoin/htlc/btcHTLC.ts:40](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/htlc/btcHTLC.ts#L40)*

SHA256 hash of the secret.

**`memberof`** HTLCConfigBTC

___

###  sequence

• **sequence**: *number*

*Defined in [pkg/bitcoin/htlc/btcHTLC.ts:33](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/htlc/btcHTLC.ts#L33)*

How many blocks need to be mined before refund is possible.

**`memberof`** HTLCConfigBTC

___

###  transactionID

• **transactionID**: *string*

*Defined in [pkg/bitcoin/htlc/btcHTLC.ts:19](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/htlc/btcHTLC.ts#L19)*

The transaction id from the preceeding transaction.

**`memberof`** HTLCConfigBTC
