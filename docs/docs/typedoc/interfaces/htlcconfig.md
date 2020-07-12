---
id: "htlcconfig"
title: "HTLCConfig"
sidebar_label: "HTLCConfig"
---

[swapchain documentation](../index.md) › [Globals](../globals.md) › [HTLCConfig](htlcconfig.md)

Contains all necessary information to create an HTLC on Bitshares blockchain

**`interface`** HTLCConfig

## Hierarchy

- **HTLCConfig**

## Index

### Properties

- [amount](htlcconfig.md#amount)
- [asset](htlcconfig.md#asset)
- [hash](htlcconfig.md#hash)
- [privateKey](htlcconfig.md#privatekey)
- [time](htlcconfig.md#time)

## Properties

### amount

• **amount**: _number_

Defined in pkg/bitshares/htlc/btsHTLC.ts:16

How much you want to send.

**`memberof`** HTLCConfig

---

### asset

• **asset**: _string_

Defined in pkg/bitshares/htlc/btsHTLC.ts:23

The type/currency you want to send.

**`memberof`** HTLCConfig

---

### hash

• **hash**: _Buffer_

Defined in pkg/bitshares/htlc/btsHTLC.ts:37

SHA256 hash of the secret.

**`memberof`** HTLCConfig

---

### privateKey

• **privateKey**: _string_

Defined in pkg/bitshares/htlc/btsHTLC.ts:45

Private key of the creator in WIF format.

**`memberof`** HTLCConfig

---

### time

• **time**: _number_

Defined in pkg/bitshares/htlc/btsHTLC.ts:30

TTL for the timelock in seconds. After this time passes the contract will be automatically redeemed by the sender.

**`memberof`** HTLCConfig
