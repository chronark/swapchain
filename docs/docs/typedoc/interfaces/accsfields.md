---
id: "accsfields"
title: "ACCSFields"
sidebar_label: "ACCSFields"
---

[swapchain documentation](../index.md) › [Globals](../globals.md) › [ACCSFields](accsfields.md)

## Hierarchy

- **ACCSFields**

## Index

### Properties

- [amountToReceive](accsfields.md#amounttoreceive)
- [amountToSend](accsfields.md#amounttosend)
- [bitcoinPrivateKey](accsfields.md#bitcoinprivatekey)
- [bitcoinTxID](accsfields.md#bitcointxid)
- [bitsharesPrivateKey](accsfields.md#bitsharesprivatekey)
- [counterpartyBitcoinPublicKey](accsfields.md#counterpartybitcoinpublickey)
- [counterpartyBitsharesAccountName](accsfields.md#counterpartybitsharesaccountname)
- [currencyToGive](accsfields.md#currencytogive)
- [mode](accsfields.md#mode)
- [networkToTrade](accsfields.md#networktotrade)
- [priority](accsfields.md#priority)
- [rate](accsfields.md#rate)
- [secret](accsfields.md#secret)
- [timelock](accsfields.md#timelock)

## Properties

### amountToReceive

• **amountToReceive**: _number_

Defined in accs/accs.ts:39

The amount to receive.

---

### amountToSend

• **amountToSend**: _number_

Defined in accs/accs.ts:29

The amount to send.

---

### bitcoinPrivateKey

• **bitcoinPrivateKey**: _string_

Defined in accs/accs.ts:44

The Bitcoin private key.

---

### bitcoinTxID

• **bitcoinTxID**: _string_

Defined in accs/accs.ts:64

The Bitcoin transaction ID to spend.

---

### bitsharesPrivateKey

• **bitsharesPrivateKey**: _string_

Defined in accs/accs.ts:49

The Bitshares private key.

---

### counterpartyBitcoinPublicKey

• **counterpartyBitcoinPublicKey**: _string_

Defined in accs/accs.ts:54

The Bitcoin public key of the counterparty.

---

### counterpartyBitsharesAccountName

• **counterpartyBitsharesAccountName**: _string_

Defined in accs/accs.ts:59

The Bitshares account name of the counterparty.

---

### currencyToGive

• **currencyToGive**: _string_

Defined in accs/accs.ts:24

The currency to give. Either BTC or BTS.

---

### mode

• **mode**: _string_

Defined in accs/accs.ts:14

The transaction mode. Either proposer or accepter.

---

### networkToTrade

• **networkToTrade**: _string_

Defined in accs/accs.ts:19

The network name. Either mainnet or testnet.

---

### priority

• **priority**: _number_

Defined in accs/accs.ts:74

The priority of the transactions. Either 0 (high), 1 (medium) or 2 (low).

---

### rate

• **rate**: _number_

Defined in accs/accs.ts:34

The exchange rate both parties agreed on.

---

### secret

• **secret**: _[Secret](secret.md)_

Defined in accs/accs.ts:79

A secret object with a random preimage and its corresponding SHA256 hash.

---

### timelock

• **timelock**: _number_

Defined in accs/accs.ts:69

The timelock of the transactions. Either 20 (long), 13 (medium) or 6 (short).
