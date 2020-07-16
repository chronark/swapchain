---
id: "accsconfig"
title: "ACCSConfig"
sidebar_label: "ACCSConfig"
---

[swapchain documentation](../globals.md) › [ACCSConfig](accsconfig.md)

Contains all necessary information to run an ACCS after parsing.

**`interface`** ACCSConfig

## Hierarchy

- **ACCSConfig**

## Index

### Properties

- [amountBTSMini](accsconfig.md#amountbtsmini)
- [amountSatoshi](accsconfig.md#amountsatoshi)
- [bitcoinTxID](accsconfig.md#bitcointxid)
- [bitsharesAccount](accsconfig.md#bitsharesaccount)
- [bitsharesAsset](accsconfig.md#bitsharesasset)
- [bitsharesEndpoint](accsconfig.md#bitsharesendpoint)
- [bitsharesPrivateKey](accsconfig.md#bitsharesprivatekey)
- [checkAPIInterval](accsconfig.md#checkapiinterval)
- [counterpartyBitsharesAccountName](accsconfig.md#counterpartybitsharesaccountname)
- [counterpartyKeyPairCompressedBTC](accsconfig.md#counterpartykeypaircompressedbtc)
- [keyPairCompressedBTC](accsconfig.md#keypaircompressedbtc)
- [mode](accsconfig.md#mode)
- [network](accsconfig.md#network)
- [networkName](accsconfig.md#networkname)
- [priority](accsconfig.md#priority)
- [secret](accsconfig.md#secret)
- [timelockBTC](accsconfig.md#timelockbtc)
- [timelockBTS](accsconfig.md#timelockbts)
- [type](accsconfig.md#type)

## Properties

### amountBTSMini

• **amountBTSMini**: _number_

_Defined in [pkg/accs/accs.ts:126](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L126)_

The amount of Bitshares in 1/100000 BTS.

---

### amountSatoshi

• **amountSatoshi**: _number_

_Defined in [pkg/accs/accs.ts:131](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L131)_

The amount of Bitcoin in Satoshi 1/100000000 BTC.

---

### bitcoinTxID

• **bitcoinTxID**: _string_

_Defined in [pkg/accs/accs.ts:161](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L161)_

The Bitcoin transaction id the user wants to spend.

---

### bitsharesAccount

• **bitsharesAccount**: _string_

_Defined in [pkg/accs/accs.ts:111](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L111)_

The user's own Bitshares account name.

---

### bitsharesAsset

• **bitsharesAsset**: _string_

_Defined in [pkg/accs/accs.ts:176](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L176)_

The asset on Bitshares blockchain. Either BTS or TEST.

---

### bitsharesEndpoint

• **bitsharesEndpoint**: _string_

_Defined in [pkg/accs/accs.ts:181](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L181)_

The endpoint address of the Bitshares node to connect to.

---

### bitsharesPrivateKey

• **bitsharesPrivateKey**: _string_

_Defined in [pkg/accs/accs.ts:116](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L116)_

The user's own Bitshares private key.

---

### checkAPIInterval

• **checkAPIInterval**: _number_

_Defined in [pkg/accs/accs.ts:186](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L186)_

The interval in seconds the APIs get called.

---

### counterpartyBitsharesAccountName

• **counterpartyBitsharesAccountName**: _string_

_Defined in [pkg/accs/accs.ts:121](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L121)_

The counterparty's Bitshares account name.

---

### counterpartyKeyPairCompressedBTC

• **counterpartyKeyPairCompressedBTC**: _ECPairInterface_

_Defined in [pkg/accs/accs.ts:141](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L141)_

The counterparty's Bitcoin compressed keypair. Only contains a public key!

---

### keyPairCompressedBTC

• **keyPairCompressedBTC**: _ECPairInterface_

_Defined in [pkg/accs/accs.ts:136](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L136)_

The user's own Bitcoin compressed keypair.

---

### mode

• **mode**: _string_

_Defined in [pkg/accs/accs.ts:96](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L96)_

The transaction mode. Either proposer or accepter.

---

### network

• **network**: _Network_

_Defined in [pkg/accs/accs.ts:166](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L166)_

The Bitcoin network object.

---

### networkName

• **networkName**: _string_

_Defined in [pkg/accs/accs.ts:171](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L171)_

The network name. Either mainnet or testnet.

---

### priority

• **priority**: _number_

_Defined in [pkg/accs/accs.ts:106](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L106)_

The Bitcoin transaction priority (0 = high, 1 = medium, 2 = low)

---

### secret

• **secret**: _[Secret](secret.md)_

_Defined in [pkg/accs/accs.ts:156](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L156)_

A secret object with a random preimage and its corresponding SHA256 hash.

---

### timelockBTC

• **timelockBTC**: _number_

_Defined in [pkg/accs/accs.ts:146](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L146)_

The timelock for the Bitcoin blockchain in blocks.

---

### timelockBTS

• **timelockBTS**: _number_

_Defined in [pkg/accs/accs.ts:151](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L151)_

The timelock for the Bitshares blockchain in seconds.

---

### type

• **type**: _string_

_Defined in [pkg/accs/accs.ts:101](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/accs/accs.ts#L101)_

The transaction type. Either BTC or BTS.
