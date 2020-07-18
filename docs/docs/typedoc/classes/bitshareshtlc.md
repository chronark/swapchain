---
id: "bitshareshtlc"
title: "BitsharesHTLC"
sidebar_label: "BitsharesHTLC"
---

[swapchain documentation](../globals.md) › [BitsharesHTLC](bitshareshtlc.md)

Handler to create HTLCs on the bitshares blockchain using a specified node.

## Hierarchy

- **BitsharesHTLC**

## Index

### Constructors

- [constructor](bitshareshtlc.md#constructor)

### Properties

- [node](bitshareshtlc.md#private-node)
- [receiverID](bitshareshtlc.md#private-receiverid)
- [senderID](bitshareshtlc.md#private-senderid)

### Methods

- [create](bitshareshtlc.md#private-create)
- [redeem](bitshareshtlc.md#private-redeem)

## Constructors

### constructor

\+ **new BitsharesHTLC**(`node`: string, `senderID`: string, `receiverID`: string): _[BitsharesHTLC](bitshareshtlc.md)_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:56](https://github.com/chronark/swapchain/blob/281c0f2/src/pkg/bitshares/htlc/btsHTLC.ts#L56)_

Creates an instance of BitsharesHTLC.

**`memberof`** BitsharesHTLC

**Parameters:**

| Name         | Type   | Description                                   |
| ------------ | ------ | --------------------------------------------- |
| `node`       | string | The Bitshares node you want to connect to.    |
| `senderID`   | string | The account that is creating the transaction. |
| `receiverID` | string | The receiving account.                        |

**Returns:** _[BitsharesHTLC](bitshareshtlc.md)_

## Properties

### `Private` node

• **node**: _string_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:54](https://github.com/chronark/swapchain/blob/281c0f2/src/pkg/bitshares/htlc/btsHTLC.ts#L54)_

---

### `Private` receiverID

• **receiverID**: _string_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:56](https://github.com/chronark/swapchain/blob/281c0f2/src/pkg/bitshares/htlc/btsHTLC.ts#L56)_

---

### `Private` senderID

• **senderID**: _string_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:55](https://github.com/chronark/swapchain/blob/281c0f2/src/pkg/bitshares/htlc/btsHTLC.ts#L55)_

## Methods

### `Private` create

▸ **create**(`config`: [HTLCConfig](../interfaces/htlcconfig.md)): _Promise‹boolean›_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:79](https://github.com/chronark/swapchain/blob/281c0f2/src/pkg/bitshares/htlc/btsHTLC.ts#L79)_

Create and send the actual HTLC.

**`memberof`** BitsharesHTLC

**Parameters:**

| Name     | Type                                      | Description                        |
| -------- | ----------------------------------------- | ---------------------------------- |
| `config` | [HTLCConfig](../interfaces/htlcconfig.md) | Configuration object for the HTLC. |

**Returns:** _Promise‹boolean›_

Success status. Can be used for user feedback.

---

### `Private` redeem

▸ **redeem**(`amount`: number, `privateKey`: string, `secret`: [Secret](../interfaces/secret.md)): _Promise‹boolean›_

_Defined in [pkg/bitshares/htlc/btsHTLC.ts:117](https://github.com/chronark/swapchain/blob/281c0f2/src/pkg/bitshares/htlc/btsHTLC.ts#L117)_

Redeem the actual HTLC.

Never call this function directly but use `redeem()` instead.
That's because the websocket must be open before redeeming an HTLC.

**`memberof`** BitsharesHTLC

**Parameters:**

| Name         | Type                              | Description                                |
| ------------ | --------------------------------- | ------------------------------------------ |
| `amount`     | number                            | The amount of assets of the HTLC.          |
| `privateKey` | string                            | Private key of the redeemer in WIF format. |
| `secret`     | [Secret](../interfaces/secret.md) | A secret object with the correct preimage. |

**Returns:** _Promise‹boolean›_

Success status. Can be used for user feedback.
