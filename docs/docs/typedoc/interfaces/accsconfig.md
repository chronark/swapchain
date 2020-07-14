---
id: "accsconfig"
title: "ACCSConfig"
sidebar_label: "ACCSConfig"
---

[swapchain documentation](../globals.md) › [ACCSConfig](accsconfig.md)

Contains all necessary information to run an ACCS after parsing.

**`interface`** ACCSConfig

## Hierarchy

* **ACCSConfig**

## Index

### Properties

* [amountBTSMini](accsconfig.md#amountbtsmini)
* [amountSatoshi](accsconfig.md#amountsatoshi)
* [bitcoinTxID](accsconfig.md#bitcointxid)
* [bitsharesAccount](accsconfig.md#bitsharesaccount)
* [bitsharesAsset](accsconfig.md#bitsharesasset)
* [bitsharesEndpoint](accsconfig.md#bitsharesendpoint)
* [bitsharesPrivateKey](accsconfig.md#bitsharesprivatekey)
* [checkAPIInterval](accsconfig.md#checkapiinterval)
* [counterpartyBitsharesAccountName](accsconfig.md#counterpartybitsharesaccountname)
* [counterpartyKeyPairCompressedBTC](accsconfig.md#counterpartykeypaircompressedbtc)
* [keyPairCompressedBTC](accsconfig.md#keypaircompressedbtc)
* [mode](accsconfig.md#mode)
* [network](accsconfig.md#network)
* [networkName](accsconfig.md#networkname)
* [priority](accsconfig.md#priority)
* [secret](accsconfig.md#secret)
* [timelockBTC](accsconfig.md#timelockbtc)
* [timelockBTS](accsconfig.md#timelockbts)
* [type](accsconfig.md#type)

## Properties

###  amountBTSMini

• **amountBTSMini**: *number*

*Defined in [pkg/accs/accs.ts:126](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L126)*

The amount of Bitshares in 1/100000 BTS.

___

###  amountSatoshi

• **amountSatoshi**: *number*

*Defined in [pkg/accs/accs.ts:131](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L131)*

The amount of Bitcoin in Satoshi 1/100000000 BTC.

___

###  bitcoinTxID

• **bitcoinTxID**: *string*

*Defined in [pkg/accs/accs.ts:161](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L161)*

The Bitcoin transaction id the user wants to spend.

___

###  bitsharesAccount

• **bitsharesAccount**: *string*

*Defined in [pkg/accs/accs.ts:111](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L111)*

The user's own Bitshares account name.

___

###  bitsharesAsset

• **bitsharesAsset**: *string*

*Defined in [pkg/accs/accs.ts:176](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L176)*

The asset on Bitshares blockchain. Either BTS or TEST.

___

###  bitsharesEndpoint

• **bitsharesEndpoint**: *string*

*Defined in [pkg/accs/accs.ts:181](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L181)*

The endpoint address of the Bitshares node to connect to.

___

###  bitsharesPrivateKey

• **bitsharesPrivateKey**: *string*

*Defined in [pkg/accs/accs.ts:116](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L116)*

The user's own Bitshares private key.

___

###  checkAPIInterval

• **checkAPIInterval**: *number*

*Defined in [pkg/accs/accs.ts:186](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L186)*

The interval in seconds the APIs get called.

___

###  counterpartyBitsharesAccountName

• **counterpartyBitsharesAccountName**: *string*

*Defined in [pkg/accs/accs.ts:121](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L121)*

The counterparty's Bitshares account name.

___

###  counterpartyKeyPairCompressedBTC

• **counterpartyKeyPairCompressedBTC**: *ECPairInterface*

*Defined in [pkg/accs/accs.ts:141](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L141)*

The counterparty's Bitcoin compressed keypair. Only contains a public key!

___

###  keyPairCompressedBTC

• **keyPairCompressedBTC**: *ECPairInterface*

*Defined in [pkg/accs/accs.ts:136](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L136)*

The user's own Bitcoin compressed keypair.

___

###  mode

• **mode**: *string*

*Defined in [pkg/accs/accs.ts:96](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L96)*

The transaction mode. Either proposer or accepter.

___

###  network

• **network**: *Network*

*Defined in [pkg/accs/accs.ts:166](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L166)*

The Bitcoin network object.

___

###  networkName

• **networkName**: *string*

*Defined in [pkg/accs/accs.ts:171](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L171)*

The network name. Either mainnet or testnet.

___

###  priority

• **priority**: *number*

*Defined in [pkg/accs/accs.ts:106](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L106)*

The Bitcoin transaction priority (0 = high, 1 = medium, 2 = low)

___

###  secret

• **secret**: *[Secret](secret.md)*

*Defined in [pkg/accs/accs.ts:156](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L156)*

A secret object with a random preimage and its corresponding SHA256 hash.

___

###  timelockBTC

• **timelockBTC**: *number*

*Defined in [pkg/accs/accs.ts:146](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L146)*

The timelock for the Bitcoin blockchain in blocks.

___

###  timelockBTS

• **timelockBTS**: *number*

*Defined in [pkg/accs/accs.ts:151](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L151)*

The timelock for the Bitshares blockchain in seconds.

___

###  type

• **type**: *string*

*Defined in [pkg/accs/accs.ts:101](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L101)*

The transaction type. Either BTC or BTS.