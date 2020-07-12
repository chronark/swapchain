---
id: "accsconfig"
title: "ACCSConfig"
sidebar_label: "ACCSConfig"
---

[swapchain documentation](../index.md) › [Globals](../globals.md) › [ACCSConfig](accsconfig.md)

Contains all necessary information to run an ACCS.

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

Defined in accs/accs.ts:121

The amount of Bitshares in 1/100000 BTS.

---

### amountSatoshi

• **amountSatoshi**: _number_

Defined in accs/accs.ts:126

The amount of Bitcoin in Satoshi 1/100000000 BTC.

---

### bitcoinTxID

• **bitcoinTxID**: _string_

Defined in accs/accs.ts:156

The Bitcoin transaction id the user wants to spend.

---

### bitsharesAccount

• **bitsharesAccount**: _string_

Defined in accs/accs.ts:106

The user's own Bitshares account name.

---

### bitsharesAsset

• **bitsharesAsset**: _string_

Defined in accs/accs.ts:171

The asset on Bitshares blockchain. Either BTS or TEST.

---

### bitsharesEndpoint

• **bitsharesEndpoint**: _string_

Defined in accs/accs.ts:176

The endpoint address of the Bitshares node to connect to.

---

### bitsharesPrivateKey

• **bitsharesPrivateKey**: _string_

Defined in accs/accs.ts:111

The user's own Bitshares private key.

---

### counterpartyBitsharesAccountName

• **counterpartyBitsharesAccountName**: _string_

Defined in accs/accs.ts:116

The counterparty's Bitshares account name.

---

### counterpartyKeyPairCompressedBTC

• **counterpartyKeyPairCompressedBTC**: _ECPairInterface_

Defined in accs/accs.ts:136

The counterparty's Bitcoin compressed keypair. Only contains a public key!

---

### keyPairCompressedBTC

• **keyPairCompressedBTC**: _ECPairInterface_

Defined in accs/accs.ts:131

The user's own Bitcoin compressed keypair.

---

### mode

• **mode**: _string_

Defined in accs/accs.ts:91

The transaction mode. Either proposer or accepter.

---

### network

• **network**: _Network_

Defined in accs/accs.ts:161

The Bitcoin network object.

---

### networkName

• **networkName**: _string_

Defined in accs/accs.ts:166

The network name. Either mainnet or testnet.

---

### priority

• **priority**: _number_

Defined in accs/accs.ts:101

The Bitcoin transaction priority (0 = high, 1 = medium, 2 = low)

---

### secret

• **secret**: _[Secret](secret.md)_

Defined in accs/accs.ts:151

A secret object with a random preimage and its corresponding SHA256 hash.

---

### timelockBTC

• **timelockBTC**: _number_

Defined in accs/accs.ts:141

The timelock for the Bitcoin blockchain in blocks.

---

### timelockBTS

• **timelockBTS**: _number_

Defined in accs/accs.ts:146

The timelock for the Bitshares blockchain in seconds.

---

### type

• **type**: _string_

Defined in accs/accs.ts:96

The transaction type. Either BTC or BTS.
