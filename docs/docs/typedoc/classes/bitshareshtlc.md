---
id: "bitshareshtlc"
title: "BitsharesHTLC"
sidebar_label: "BitsharesHTLC"
---

[swapchain documentation](../index.md) › [Globals](../globals.md) › [BitsharesHTLC](bitshareshtlc.md)

Handler to create HTLCs on the bitshares blockchain using a specified node.

## Hierarchy

- **BitsharesHTLC**

## Index

### Constructors

- [constructor](bitshareshtlc.md#constructor)

### Properties

- [keepLooking](bitshareshtlc.md#private-keeplooking)
- [node](bitshareshtlc.md#private-node)
- [receiver](bitshareshtlc.md#private-receiver)
- [sender](bitshareshtlc.md#private-sender)
- [websocket](bitshareshtlc.md#private-websocket)

### Methods

- [create](bitshareshtlc.md#create)
- [createHTLC](bitshareshtlc.md#private-createhtlc)
- [getID](bitshareshtlc.md#getid)
- [openSocket](bitshareshtlc.md#private-opensocket)
- [redeem](bitshareshtlc.md#redeem)
- [redeemHTLC](bitshareshtlc.md#private-redeemhtlc)
- [stopLooking](bitshareshtlc.md#stoplooking)

## Constructors

### constructor

\+ **new BitsharesHTLC**(`node`: string, `sender`: string, `receiver`: string): _[BitsharesHTLC](bitshareshtlc.md)_

Defined in pkg/bitshares/htlc/btsHTLC.ts:58

Creates an instance of BitsharesHTLC.

**`memberof`** BitsharesHTLC

**Parameters:**

| Name       | Type   | Description                                   |
| ---------- | ------ | --------------------------------------------- |
| `node`     | string | The Bitshares node you want to connect to.    |
| `sender`   | string | The account that is creating the transaction. |
| `receiver` | string | The receiving account.                        |

**Returns:** _[BitsharesHTLC](bitshareshtlc.md)_

## Properties

### `Private` keepLooking

• **keepLooking**: _boolean_

Defined in pkg/bitshares/htlc/btsHTLC.ts:58

---

### `Private` node

• **node**: _string_

Defined in pkg/bitshares/htlc/btsHTLC.ts:54

---

### `Private` receiver

• **receiver**: _string_

Defined in pkg/bitshares/htlc/btsHTLC.ts:56

---

### `Private` sender

• **sender**: _string_

Defined in pkg/bitshares/htlc/btsHTLC.ts:55

---

### `Private` websocket

• **websocket**: _Promise‹void› | null_

Defined in pkg/bitshares/htlc/btsHTLC.ts:57

## Methods

### create

▸ **create**(`config`: [HTLCConfig](../interfaces/htlcconfig.md)): _Promise‹boolean›_

Defined in pkg/bitshares/htlc/btsHTLC.ts:102

Wrapper function to open the websocket if necessary.

**`memberof`** BitsharesHTLC

**Parameters:**

| Name     | Type                                      | Description       |
| -------- | ----------------------------------------- | ----------------- |
| `config` | [HTLCConfig](../interfaces/htlcconfig.md) | HTLC information. |

**Returns:** _Promise‹boolean›_

Success or failure.

---

### `Private` createHTLC

▸ **createHTLC**(`config`: [HTLCConfig](../interfaces/htlcconfig.md)): _Promise‹boolean›_

Defined in pkg/bitshares/htlc/btsHTLC.ts:138

Create and send the actual HTLC.

Never call this function directly but use `create()` instead.
That's because the websocket must be open before creating an HTLC.

**`memberof`** BitsharesHTLC

**Parameters:**

| Name     | Type                                      | Description                        |
| -------- | ----------------------------------------- | ---------------------------------- |
| `config` | [HTLCConfig](../interfaces/htlcconfig.md) | Configuration object for the HTLC. |

**Returns:** _Promise‹boolean›_

Success status. Can be used for user feedback.

---

### getID

▸ **getID**(`amount`: number, `hash`: Buffer): _Promise‹string›_

Defined in pkg/bitshares/htlc/btsHTLC.ts:222

Get the HTLC BitShares ID.

Only for internal purposes.
The HTLC ID is necessary to redeem an HTLC.
Websocket must be open.

**`memberof`** BitsharesHTLC

**Parameters:**

| Name     | Type   | Description                       |
| -------- | ------ | --------------------------------- |
| `amount` | number | The amount of assets of the HTLC. |
| `hash`   | Buffer | The SHA256 hash of the secret.    |

**Returns:** _Promise‹string›_

HTLC ID of an instance or empty string if no matching HTLC was found.

---

### `Private` openSocket

▸ **openSocket**(`node`: string): _Promise‹void›_

Defined in pkg/bitshares/htlc/btsHTLC.ts:84

Opens a websocket to a bitshares node

This has to be done before you can interact with the blockchain.

**`memberof`** BitsharesHTLC

**Parameters:**

| Name   | Type   | Description           |
| ------ | ------ | --------------------- |
| `node` | string | The address of a node |

**Returns:** _Promise‹void›_

---

### redeem

▸ **redeem**(`amount`: number, `privateKey`: string, `secret`: [Secret](../interfaces/secret.md)): _Promise‹boolean›_

Defined in pkg/bitshares/htlc/btsHTLC.ts:119

Wrapper function to open the websocket if necessary.

**`memberof`** BitsharesHTLC

**Parameters:**

| Name         | Type                              | Description                                |
| ------------ | --------------------------------- | ------------------------------------------ |
| `amount`     | number                            | The asset amount of the HTLC.              |
| `privateKey` | string                            | Private key of the redeemer in WIF format. |
| `secret`     | [Secret](../interfaces/secret.md) | A secret object.                           |

**Returns:** _Promise‹boolean›_

Success or failure.

---

### `Private` redeemHTLC

▸ **redeemHTLC**(`amount`: number, `privateKey`: string, `secret`: [Secret](../interfaces/secret.md)): _Promise‹boolean›_

Defined in pkg/bitshares/htlc/btsHTLC.ts:181

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

---

### stopLooking

▸ **stopLooking**(): _void_

Defined in pkg/bitshares/htlc/btsHTLC.ts:91

Stops looking for matching HTLC.

**Returns:** _void_
