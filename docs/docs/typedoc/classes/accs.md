---
id: "accs"
title: "ACCS"
sidebar_label: "ACCS"
---

[swapchain documentation](../index.md) › [Globals](../globals.md) › [ACCS](accs.md)

Handler to create HTLCs on the respective blockchains to run an ACCS.

## Hierarchy

- **ACCS**

## Index

### Methods

- [parseUserInput](accs.md#static-parseuserinput)
- [proposeBTCForBTS](accs.md#static-proposebtcforbts)
- [proposeBTSForBTC](accs.md#static-proposebtsforbtc)
- [run](accs.md#static-run)
- [takeBTCForBTS](accs.md#static-takebtcforbts)
- [takeBTSForBTC](accs.md#static-takebtsforbtc)

## Methods

### `Static` parseUserInput

▸ **parseUserInput**(`fields`: [ACCSFields](../interfaces/accsfields.md)): _Promise‹[ACCSConfig](../interfaces/accsconfig.md)›_

Defined in accs/accs.ts:190

Parse user input to create config

**Parameters:**

| Name     | Type                                      | Description |
| -------- | ----------------------------------------- | ----------- |
| `fields` | [ACCSFields](../interfaces/accsfields.md) |             |

**Returns:** _Promise‹[ACCSConfig](../interfaces/accsconfig.md)›_

---

### `Static` proposeBTCForBTS

▸ **proposeBTCForBTS**(`config`: [ACCSConfig](../interfaces/accsconfig.md)): _Promise‹void›_

Defined in accs/accs.ts:311

Handles ACCS for proposer who wants BTC for BTS.

**`memberof`** ACCS

**Parameters:**

| Name     | Type                                      |
| -------- | ----------------------------------------- |
| `config` | [ACCSConfig](../interfaces/accsconfig.md) |

**Returns:** _Promise‹void›_

---

### `Static` proposeBTSForBTC

▸ **proposeBTSForBTC**(`config`: [ACCSConfig](../interfaces/accsconfig.md)): _Promise‹void›_

Defined in accs/accs.ts:250

Handles ACCS for proposer who wants BTS for BTC.

**`memberof`** ACCS

**Parameters:**

| Name     | Type                                      |
| -------- | ----------------------------------------- |
| `config` | [ACCSConfig](../interfaces/accsconfig.md) |

**Returns:** _Promise‹void›_

---

### `Static` run

▸ **run**(`fields`: [ACCSFields](../interfaces/accsfields.md)): _Promise‹void›_

Defined in accs/accs.ts:573

Entrypoint for web app and CLI. Calls respective parse and swap methods.

**`memberof`** ACCS

**Parameters:**

| Name     | Type                                      | Description                |
| -------- | ----------------------------------------- | -------------------------- |
| `fields` | [ACCSFields](../interfaces/accsfields.md) | The raw user input object. |

**Returns:** _Promise‹void›_

---

### `Static` takeBTCForBTS

▸ **takeBTCForBTS**(`config`: [ACCSConfig](../interfaces/accsconfig.md)): _Promise‹void›_

Defined in accs/accs.ts:472

Handles ACCS for accepter who wants BTC for BTS.

**`memberof`** ACCS

**Parameters:**

| Name     | Type                                      |
| -------- | ----------------------------------------- |
| `config` | [ACCSConfig](../interfaces/accsconfig.md) |

**Returns:** _Promise‹void›_

---

### `Static` takeBTSForBTC

▸ **takeBTSForBTC**(`config`: [ACCSConfig](../interfaces/accsconfig.md)): _Promise‹void›_

Defined in accs/accs.ts:376

Handles ACCS for accepter who wants BTS for BTC.

**`memberof`** ACCS

**Parameters:**

| Name     | Type                                      |
| -------- | ----------------------------------------- |
| `config` | [ACCSConfig](../interfaces/accsconfig.md) |

**Returns:** _Promise‹void›_
