---
id: "htlcconfigbtc"
title: "HTLCConfigBTC"
sidebar_label: "HTLCConfigBTC"
---

[swapchain documentation](../globals.md) › [HTLCConfigBTC](htlcconfigbtc.md)

Contains all necessary information to create an HTLC on Bitcoin blockchain

**`interface`** HTLCConfigBTC

## Hierarchy

- **HTLCConfigBTC**

## Index

### Properties

- [amount](htlcconfigbtc.md#amount)
- [hash](htlcconfigbtc.md#hash)
- [sequence](htlcconfigbtc.md#sequence)
- [transactionID](htlcconfigbtc.md#transactionid)

## Properties

### amount

• **amount**: _number_

_Defined in [pkg/bitcoin/htlc/btcHTLC.ts:26](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/htlc/btcHTLC.ts#L26)_

The amount of satoshi to exchange.

**`memberof`** HTLCConfigBTC

---

### hash

• **hash**: _Buffer_

_Defined in [pkg/bitcoin/htlc/btcHTLC.ts:40](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/htlc/btcHTLC.ts#L40)_

SHA256 hash of the secret.

**`memberof`** HTLCConfigBTC

---

### sequence

• **sequence**: _number_

_Defined in [pkg/bitcoin/htlc/btcHTLC.ts:33](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/htlc/btcHTLC.ts#L33)_

How many blocks need to be mined before refund is possible.

**`memberof`** HTLCConfigBTC

---

### transactionID

• **transactionID**: _string_

_Defined in [pkg/bitcoin/htlc/btcHTLC.ts:19](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/htlc/btcHTLC.ts#L19)_

The transaction id from the preceeding transaction.

**`memberof`** HTLCConfigBTC
