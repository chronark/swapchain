---
id: "accsfields"
title: "ACCSFields"
sidebar_label: "ACCSFields"
---

[swapchain documentation](../globals.md) › [ACCSFields](accsfields.md)

## Hierarchy

* **ACCSFields**

## Index

### Properties

* [amountToReceive](accsfields.md#amounttoreceive)
* [amountToSend](accsfields.md#amounttosend)
* [bitcoinPrivateKey](accsfields.md#bitcoinprivatekey)
* [bitcoinTxID](accsfields.md#bitcointxid)
* [bitsharesPrivateKey](accsfields.md#bitsharesprivatekey)
* [counterpartyBitcoinPublicKey](accsfields.md#counterpartybitcoinpublickey)
* [counterpartyBitsharesAccountName](accsfields.md#counterpartybitsharesaccountname)
* [currencyToGive](accsfields.md#currencytogive)
* [mode](accsfields.md#mode)
* [networkToTrade](accsfields.md#networktotrade)
* [priority](accsfields.md#priority)
* [rate](accsfields.md#rate)
* [secret](accsfields.md#secret)

## Properties

###  amountToReceive

• **amountToReceive**: *number*

*Defined in [accs/accs.ts:39](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L39)*

The amount to receive.

___

###  amountToSend

• **amountToSend**: *number*

*Defined in [accs/accs.ts:29](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L29)*

The amount to send.

___

###  bitcoinPrivateKey

• **bitcoinPrivateKey**: *string*

*Defined in [accs/accs.ts:44](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L44)*

The Bitcoin private key.

___

###  bitcoinTxID

• **bitcoinTxID**: *string*

*Defined in [accs/accs.ts:64](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L64)*

The Bitcoin transaction ID to spend.

___

###  bitsharesPrivateKey

• **bitsharesPrivateKey**: *string*

*Defined in [accs/accs.ts:49](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L49)*

The Bitshares private key.

___

###  counterpartyBitcoinPublicKey

• **counterpartyBitcoinPublicKey**: *string*

*Defined in [accs/accs.ts:54](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L54)*

The Bitcoin public key of the counterparty.

___

###  counterpartyBitsharesAccountName

• **counterpartyBitsharesAccountName**: *string*

*Defined in [accs/accs.ts:59](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L59)*

The Bitshares account name of the counterparty.

___

###  currencyToGive

• **currencyToGive**: *string*

*Defined in [accs/accs.ts:24](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L24)*

The currency to give. Either BTC or BTS.

___

###  mode

• **mode**: *string*

*Defined in [accs/accs.ts:14](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L14)*

The transaction mode. Either proposer or accepter.

___

###  networkToTrade

• **networkToTrade**: *string*

*Defined in [accs/accs.ts:19](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L19)*

The network name. Either mainnet or testnet.

___

###  priority

• **priority**: *number*

*Defined in [accs/accs.ts:69](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L69)*

The priority of the transactions. Either 0 (high), 1 (medium) or 2 (low).

___

###  rate

• **rate**: *number*

*Defined in [accs/accs.ts:34](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L34)*

The exchange rate both parties agreed on.

___

###  secret

• **secret**: *[Secret](secret.md)*

*Defined in [accs/accs.ts:74](https://github.com/chronark/swapchain/blob/11f7027/src/accs/accs.ts#L74)*

A secret object with a random preimage and its corresponding SHA256 hash.
