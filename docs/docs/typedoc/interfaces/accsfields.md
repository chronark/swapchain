---
id: "accsfields"
title: "ACCSFields"
sidebar_label: "ACCSFields"
---

[swapchain documentation](../globals.md) › [ACCSFields](accsfields.md)

Contains raw user input to run an ACCS. Needs to get parsed.

**`interface`** ACCSFields

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
- [secretHash](accsfields.md#optional-secrethash)

## Properties

### amountToReceive

• **amountToReceive**: _number_

_Defined in [pkg/accs/accs.ts:44](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L44)_

The amount to receive.

---

### amountToSend

• **amountToSend**: _number_

_Defined in [pkg/accs/accs.ts:34](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L34)_

The amount to send.

---

### bitcoinPrivateKey

• **bitcoinPrivateKey**: _string_

_Defined in [pkg/accs/accs.ts:49](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L49)_

The Bitcoin private key.

---

### bitcoinTxID

• **bitcoinTxID**: _string_

_Defined in [pkg/accs/accs.ts:69](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L69)_

The Bitcoin transaction ID to spend.

---

### bitsharesPrivateKey

• **bitsharesPrivateKey**: _string_

_Defined in [pkg/accs/accs.ts:54](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L54)_

The Bitshares private key.

---

### counterpartyBitcoinPublicKey

• **counterpartyBitcoinPublicKey**: _string_

_Defined in [pkg/accs/accs.ts:59](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L59)_

The Bitcoin public key of the counterparty.

---

### counterpartyBitsharesAccountName

• **counterpartyBitsharesAccountName**: _string_

_Defined in [pkg/accs/accs.ts:64](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L64)_

The Bitshares account name of the counterparty.

---

### currencyToGive

• **currencyToGive**: _string_

_Defined in [pkg/accs/accs.ts:29](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L29)_

The currency to give. Either BTC or BTS.

---

### mode

• **mode**: _string_

_Defined in [pkg/accs/accs.ts:19](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L19)_

The transaction mode. Either proposer or accepter.

---

### networkToTrade

• **networkToTrade**: _string_

_Defined in [pkg/accs/accs.ts:24](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L24)_

The network name. Either mainnet or testnet.

---

### priority

• **priority**: _number_

_Defined in [pkg/accs/accs.ts:74](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L74)_

The priority of the transactions. Either 0 (high), 1 (medium) or 2 (low).

---

### rate

• **rate**: _number_

_Defined in [pkg/accs/accs.ts:39](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L39)_

The exchange rate both parties agreed on.

---

### secret

• **secret**: _[Secret](secret.md)_

_Defined in [pkg/accs/accs.ts:79](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L79)_

A secret object with a random preimage and its corresponding SHA256 hash.

---

### `Optional` secretHash

• **secretHash**? : _undefined | string_

_Defined in [pkg/accs/accs.ts:84](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/accs/accs.ts#L84)_

A secret SHA256 hash.
