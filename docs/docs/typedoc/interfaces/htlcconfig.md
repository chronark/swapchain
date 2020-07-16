---
id: "htlcconfig"
title: "HTLCConfig"
sidebar_label: "HTLCConfig"
---

[swapchain documentation](../globals.md) › [HTLCConfig](htlcconfig.md)

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

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:16](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L16)_

How much you want to send.

**`memberof`** HTLCConfig

---

### asset

• **asset**: _string_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:23](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L23)_

The type/currency you want to send.

**`memberof`** HTLCConfig

---

### hash

• **hash**: _Buffer_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:37](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L37)_

SHA256 hash of the secret.

**`memberof`** HTLCConfig

---

### privateKey

• **privateKey**: _string_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:45](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L45)_

Private key of the creator in WIF format.

**`memberof`** HTLCConfig

---

### time

• **time**: _number_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:30](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L30)_

TTL for the timelock in seconds. After this time passes the contract will be automatically redeemed by the sender.

**`memberof`** HTLCConfig
