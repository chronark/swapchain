---
id: "htlcconfig"
title: "HTLCConfig"
sidebar_label: "HTLCConfig"
---

[swapchain documentation](../globals.md) › [HTLCConfig](htlcconfig.md)

Contains all necessary information to create an HTLC on Bitshares blockchain

**`interface`** HTLCConfig

## Hierarchy

* **HTLCConfig**

## Index

### Properties

* [amount](htlcconfig.md#amount)
* [asset](htlcconfig.md#asset)
* [hash](htlcconfig.md#hash)
* [privateKey](htlcconfig.md#privatekey)
* [time](htlcconfig.md#time)

## Properties

###  amount

• **amount**: *number*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:16](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L16)*

How much you want to send.

**`memberof`** HTLCConfig

___

###  asset

• **asset**: *string*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:23](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L23)*

The type/currency you want to send.

**`memberof`** HTLCConfig

___

###  hash

• **hash**: *Buffer*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:37](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L37)*

SHA256 hash of the secret.

**`memberof`** HTLCConfig

___

###  privateKey

• **privateKey**: *string*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:45](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L45)*

Private key of the creator in WIF format.

**`memberof`** HTLCConfig

___

###  time

• **time**: *number*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:30](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/htlc/btsHTLC.ts#L30)*

TTL for the timelock in seconds. After this time passes the contract will be automatically redeemed by the sender.

**`memberof`** HTLCConfig
