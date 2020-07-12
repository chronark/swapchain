---
id: "htlcconfigbtc"
title: "HTLCConfigBTC"
sidebar_label: "HTLCConfigBTC"
---

[swapchain documentation](../index.md) › [Globals](../globals.md) › [HTLCConfigBTC](htlcconfigbtc.md)

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

Defined in pkg/bitcoin/htlc/btcHTLC.ts:25

The amount of satoshi to exchange.

**`memberof`** HTLCConfigBTC

---

### hash

• **hash**: _Buffer_

Defined in pkg/bitcoin/htlc/btcHTLC.ts:39

SHA256 hash of the secret.

**`memberof`** HTLCConfigBTC

---

### sequence

• **sequence**: _number_

Defined in pkg/bitcoin/htlc/btcHTLC.ts:32

How many blocks need to be mined before refund is possible.

**`memberof`** HTLCConfigBTC

---

### transactionID

• **transactionID**: _string_

Defined in pkg/bitcoin/htlc/btcHTLC.ts:18

The transaction id from the preceeding transaction.

**`memberof`** HTLCConfigBTC
