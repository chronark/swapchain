---
id: "bitsharesapi"
title: "BitsharesAPI"
sidebar_label: "BitsharesAPI"
---

[swapchain documentation](../globals.md) › [BitsharesAPI](bitsharesapi.md)

API to connect to Bitshares blockchain

Implemented as a singleton, so there is only one websocket at the same time.
Use getInstance to get an instance and not the constructor.

## Hierarchy

- **BitsharesAPI**

## Index

### Constructors

- [constructor](bitsharesapi.md#constructor)

### Properties

- [instance](bitsharesapi.md#static-private-instance)

### Methods

- [getAccountID](bitsharesapi.md#getaccountid)
- [getHistory](bitsharesapi.md#gethistory)
- [getID](bitsharesapi.md#getid)
- [getPreimageFromHTLC](bitsharesapi.md#getpreimagefromhtlc)
- [toAccountID](bitsharesapi.md#toaccountid)
- [getInstance](bitsharesapi.md#static-getinstance)

## Constructors

### constructor

\+ **new BitsharesAPI**(): _[BitsharesAPI](bitsharesapi.md)_

_Defined in [pkg/bitshares/api/api.ts:11](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/bitshares/api/api.ts#L11)_

Do not use

Only for testing purposes. If you call the constructor, the websocket will not be open.
Use getInstance instead.

**Returns:** _[BitsharesAPI](bitsharesapi.md)_

## Properties

### `Static` `Private` instance

▪ **instance**: _[BitsharesAPI](bitsharesapi.md)_

_Defined in [pkg/bitshares/api/api.ts:11](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/bitshares/api/api.ts#L11)_

## Methods

### getAccountID

▸ **getAccountID**(`accountName`: string): _Promise‹string›_

_Defined in [pkg/bitshares/api/api.ts:43](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/bitshares/api/api.ts#L43)_

Get account ID

**Parameters:**

| Name          | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| `accountName` | string | The account name to fetch the ID for. |

**Returns:** _Promise‹string›_

The account ID.

---

### getHistory

▸ **getHistory**(`accountID`: string): _Promise‹Record‹string, any›[]›_

_Defined in [pkg/bitshares/api/api.ts:54](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/bitshares/api/api.ts#L54)_

Get account history

**Parameters:**

| Name        | Type   | Description                              |
| ----------- | ------ | ---------------------------------------- |
| `accountID` | string | The account ID to fetch the history for. |

**Returns:** _Promise‹Record‹string, any›[]›_

An array of transaction objects.

---

### getID

▸ **getID**(`senderID`: string, `receiverID`: string, `amount`: number, `hash`: Buffer, `timelock?`: undefined | number): _Promise‹string›_

_Defined in [pkg/bitshares/api/api.ts:70](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/bitshares/api/api.ts#L70)_

Get the HTLC BitShares ID

**Parameters:**

| Name         | Type                    | Description                           |
| ------------ | ----------------------- | ------------------------------------- |
| `senderID`   | string                  | The sender's account ID.              |
| `receiverID` | string                  | The receiver's account ID.            |
| `amount`     | number                  | The amount of assets of the HTLC.     |
| `hash`       | Buffer                  | The SHA256 hash of the secret.        |
| `timelock?`  | undefined &#124; number | The timelock in seconds or undefined. |

**Returns:** _Promise‹string›_

HTLC ID of an instance.

---

### getPreimageFromHTLC

▸ **getPreimageFromHTLC**(`senderID`: string, `receiverID`: string, `secretHash`: string): _Promise‹string›_

_Defined in [pkg/bitshares/api/api.ts:141](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/bitshares/api/api.ts#L141)_

Get preimage from HTLC on blockchain

**`memberof`** BitsharesAPI

**Parameters:**

| Name         | Type   | Description                         |
| ------------ | ------ | ----------------------------------- |
| `senderID`   | string | ID of the sending account.          |
| `receiverID` | string | ID of the receiving account.        |
| `secretHash` | string | Hashed preimage to verify the HTLC. |

**Returns:** _Promise‹string›_

Preimage from the HTLC.

---

### toAccountID

▸ **toAccountID**(`privateKey`: string, `network`: string): _Promise‹string›_

_Defined in [pkg/bitshares/api/api.ts:106](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/bitshares/api/api.ts#L106)_

Derive the account ID from a private key

**Parameters:**

| Name         | Type   | Description                         |
| ------------ | ------ | ----------------------------------- |
| `privateKey` | string | Private key of a bitshares account. |
| `network`    | string | Testnet or mainnet.                 |

**Returns:** _Promise‹string›_

The account ID for the private key.

---

### `Static` getInstance

▸ **getInstance**(`node`: string): _Promise‹[BitsharesAPI](bitsharesapi.md)›_

_Defined in [pkg/bitshares/api/api.ts:28](https://github.com/chronark/swapchain/blob/e6681b5/src/pkg/bitshares/api/api.ts#L28)_

Initialize websocket if there is not already one

**Parameters:**

| Name   | Type   | Description                  |
| ------ | ------ | ---------------------------- |
| `node` | string | The endpoint URL to connect. |

**Returns:** _Promise‹[BitsharesAPI](bitsharesapi.md)›_

BitsharesAPI instance.
