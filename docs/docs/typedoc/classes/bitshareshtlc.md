---
id: "bitshareshtlc"
title: "BitsharesHTLC"
sidebar_label: "BitsharesHTLC"
---

[swapchain documentation](../globals.md) › [BitsharesHTLC](bitshareshtlc.md)

Handler to create HTLCs on the bitshares blockchain using a specified node.

## Hierarchy

* **BitsharesHTLC**

## Index

### Constructors

* [constructor](bitshareshtlc.md#constructor)

### Properties

* [keepLooking](bitshareshtlc.md#private-keeplooking)
* [node](bitshareshtlc.md#private-node)
* [receiver](bitshareshtlc.md#private-receiver)
* [sender](bitshareshtlc.md#private-sender)
* [websocket](bitshareshtlc.md#private-websocket)

### Methods

* [create](bitshareshtlc.md#create)
* [createHTLC](bitshareshtlc.md#private-createhtlc)
* [getID](bitshareshtlc.md#getid)
* [openSocket](bitshareshtlc.md#private-opensocket)
* [redeem](bitshareshtlc.md#redeem)
* [redeemHTLC](bitshareshtlc.md#private-redeemhtlc)
* [stopLooking](bitshareshtlc.md#stoplooking)

## Constructors

###  constructor

\+ **new BitsharesHTLC**(`node`: string, `sender`: string, `receiver`: string): *[BitsharesHTLC](bitshareshtlc.md)*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:58](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L58)*

Creates an instance of BitsharesHTLC.

**`memberof`** BitsharesHTLC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`node` | string | The Bitshares node you want to connect to. |
`sender` | string | The account that is creating the transaction. |
`receiver` | string | The receiving account. |

**Returns:** *[BitsharesHTLC](bitshareshtlc.md)*

## Properties

### `Private` keepLooking

• **keepLooking**: *boolean*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:58](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L58)*

___

### `Private` node

• **node**: *string*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:54](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L54)*

___

### `Private` receiver

• **receiver**: *string*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:56](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L56)*

___

### `Private` sender

• **sender**: *string*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:55](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L55)*

___

### `Private` websocket

• **websocket**: *Promise‹void› | null*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:57](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L57)*

## Methods

###  create

▸ **create**(`config`: [HTLCConfig](../interfaces/htlcconfig.md)): *Promise‹boolean›*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:102](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L102)*

Wrapper function to open the websocket if necessary.

**`memberof`** BitsharesHTLC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [HTLCConfig](../interfaces/htlcconfig.md) | HTLC information. |

**Returns:** *Promise‹boolean›*

Success or failure.

___

### `Private` createHTLC

▸ **createHTLC**(`config`: [HTLCConfig](../interfaces/htlcconfig.md)): *Promise‹boolean›*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:138](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L138)*

Create and send the actual HTLC.

Never call this function directly but use `create()` instead.
That's because the websocket must be open before creating an HTLC.

**`memberof`** BitsharesHTLC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [HTLCConfig](../interfaces/htlcconfig.md) | Configuration object for the HTLC. |

**Returns:** *Promise‹boolean›*

Success status. Can be used for user feedback.

___

###  getID

▸ **getID**(`amount`: number, `hash`: Buffer): *Promise‹string›*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:222](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L222)*

Get the HTLC BitShares ID.

Only for internal purposes.
The HTLC ID is necessary to redeem an HTLC.
Websocket must be open.

**`memberof`** BitsharesHTLC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`amount` | number | The amount of assets of the HTLC. |
`hash` | Buffer | The SHA256 hash of the secret. |

**Returns:** *Promise‹string›*

HTLC ID of an instance or empty string if no matching HTLC was found.

___

### `Private` openSocket

▸ **openSocket**(`node`: string): *Promise‹void›*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:84](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L84)*

Opens a websocket to a bitshares node

This has to be done before you can interact with the blockchain.

**`memberof`** BitsharesHTLC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`node` | string | The address of a node |

**Returns:** *Promise‹void›*

___

###  redeem

▸ **redeem**(`amount`: number, `privateKey`: string, `secret`: [Secret](../interfaces/secret.md)): *Promise‹boolean›*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:119](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L119)*

Wrapper function to open the websocket if necessary.

**`memberof`** BitsharesHTLC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`amount` | number | The asset amount of the HTLC. |
`privateKey` | string | Private key of the redeemer in WIF format. |
`secret` | [Secret](../interfaces/secret.md) | A secret object. |

**Returns:** *Promise‹boolean›*

Success or failure.

___

### `Private` redeemHTLC

▸ **redeemHTLC**(`amount`: number, `privateKey`: string, `secret`: [Secret](../interfaces/secret.md)): *Promise‹boolean›*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:181](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L181)*

Redeem the actual HTLC.

Never call this function directly but use `redeem()` instead.
That's because the websocket must be open before redeeming an HTLC.

**`memberof`** BitsharesHTLC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`amount` | number | The amount of assets of the HTLC. |
`privateKey` | string | Private key of the redeemer in WIF format. |
`secret` | [Secret](../interfaces/secret.md) | A secret object with the correct preimage. |

**Returns:** *Promise‹boolean›*

Success status. Can be used for user feedback.

___

###  stopLooking

▸ **stopLooking**(): *void*

*Defined in [pkg/bitshares/htlc/btsHTLC.ts:91](https://github.com/chronark/swapchain/blob/11f7027/src/pkg/bitshares/htlc/btsHTLC.ts#L91)*

Stops looking for matching HTLC.

**Returns:** *void*
