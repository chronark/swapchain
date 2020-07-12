---
id: "globals"
title: "swapchain documentation"
sidebar_label: "Globals"
---

[swapchain documentation](index.md) › [Globals](globals.md)

## Index

### Enumerations

- [Currency](enums/currency.md)
- [Network](enums/network.md)
- [Priority](enums/priority.md)
- [State](enums/state.md)
- [Timelock](enums/timelock.md)

### Classes

- [ACCS](classes/accs.md)
- [BitcoinHTLC](classes/bitcoinhtlc.md)
- [BitsharesHTLC](classes/bitshareshtlc.md)
- [BlockStream](classes/blockstream.md)
- [Timer](classes/timer.md)

### Interfaces

- [ACCSConfig](interfaces/accsconfig.md)
- [ACCSFields](interfaces/accsfields.md)
- [BTCAddress](interfaces/btcaddress.md)
- [BTSAddress](interfaces/btsaddress.md)
- [BitcoinAPI](interfaces/bitcoinapi.md)
- [BitcoinAPIConstructor](interfaces/bitcoinapiconstructor.md)
- [HTLCConfig](interfaces/htlcconfig.md)
- [HTLCConfigBTC](interfaces/htlcconfigbtc.md)
- [Order](interfaces/order.md)
- [Secret](interfaces/secret.md)

### Type aliases

- [Props](globals.md#props)

### Variables

- [read](globals.md#const-read)

### Functions

- [Accept](globals.md#const-accept)
- [App](globals.md#const-app)
- [ComponentPage](globals.md#const-componentpage)
- [FilterButton](globals.md#const-filterbutton)
- [Form](globals.md#const-form)
- [Input](globals.md#const-input)
- [Label](globals.md#const-label)
- [LandingPage](globals.md#const-landingpage)
- [Modal](globals.md#const-modal)
- [Navbar](globals.md#const-navbar)
- [Orderbook](globals.md#const-orderbook)
- [OrderbookPage](globals.md#const-orderbookpage)
- [Propose](globals.md#const-propose)
- [RadioButton](globals.md#const-radiobutton)
- [Row](globals.md#const-row)
- [Spinner](globals.md#const-spinner)
- [SubmitButton](globals.md#const-submitbutton)
- [Table](globals.md#const-table)
- [TradingPage](globals.md#const-tradingpage)
- [askUser](globals.md#askuser)
- [fakeKey](globals.md#const-fakekey)
- [getAccount](globals.md#getaccount)
- [getAddress](globals.md#getaddress)
- [getBTCAddress](globals.md#getbtcaddress)
- [getBTSAddress](globals.md#getbtsaddress)
- [getSecret](globals.md#getsecret)
- [getUserInput](globals.md#getuserinput)
- [hash](globals.md#const-hash)
- [isValidBitcoinPrivateKey](globals.md#isvalidbitcoinprivatekey)
- [isValidBitcoinPublicKey](globals.md#isvalidbitcoinpublickey)
- [isValidBitsharesPrivateKey](globals.md#isvalidbitsharesprivatekey)
- [orderFactory](globals.md#const-orderfactory)
- [toPublicKey](globals.md#const-topublickey)
- [witnessStackToScriptWitness](globals.md#witnessstacktoscriptwitness)

### Object literals

- [status](globals.md#const-status)

## Type aliases

### Props

Ƭ **Props**: _object_

Defined in components/forms/RadioButton.tsx:3

Defined in components/forms/Label.tsx:3

Defined in components/forms/Input.tsx:3

Defined in components/forms/SubmitButton.tsx:3

Defined in components/forms/Form.tsx:2

Defined in components/Spinner.tsx:5

Defined in components/util/ComponentPage.tsx:3

Defined in components/orderbook/Row.tsx:4

Defined in components/orderbook/Table.tsx:8

Defined in components/util/Modal.tsx:3

Defined in components/orderbook/FilterButton.tsx:3

Defined in components/orderbook/Orderbook.tsx:75

#### Type declaration:

- **orders**: _[Order](interfaces/order.md)[]_

### `Optional` bg

• **bg**? : _undefined | string_

Defined in components/util/ComponentPage.tsx:6

### children

• **children**: _any_

Defined in components/util/ComponentPage.tsx:5

### footer

• **footer**: _ReactElement_

Defined in components/forms/Form.tsx:4

### main

• **main**: _ReactElement_

Defined in components/forms/Form.tsx:3

### `Optional` title

• **title**? : _undefined | string_

Defined in components/util/ComponentPage.tsx:4

## Variables

### `Const` read

• **read**: _Interface‹›_ = readline.createInterface({
input: process.stdin,
output: process.stdout,
})

Defined in cli/index.ts:6

## Functions

### `Const` Accept

▸ **Accept**(): _Element‹›_

Defined in components/forms/Accept.tsx:12

**Returns:** _Element‹›_

---

### `Const` App

▸ **App**(): _Element‹›_

Defined in App.tsx:16

**Returns:** _Element‹›_

---

### `Const` ComponentPage

▸ **ComponentPage**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/util/ComponentPage.tsx:9

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` FilterButton

▸ **FilterButton**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/orderbook/FilterButton.tsx:8

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Form

▸ **Form**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/forms/Form.tsx:7

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Input

▸ **Input**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/forms/Input.tsx:14

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Label

▸ **Label**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/forms/Label.tsx:7

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` LandingPage

▸ **LandingPage**(): _Element‹›_

Defined in components/pages/LandingPage.tsx:4

**Returns:** _Element‹›_

---

### `Const` Modal

▸ **Modal**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/util/Modal.tsx:11

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Navbar

▸ **Navbar**(): _Element‹›_

Defined in components/Navbar/Navbar.tsx:6

**Returns:** _Element‹›_

---

### `Const` Orderbook

▸ **Orderbook**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/orderbook/Orderbook.tsx:79

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` OrderbookPage

▸ **OrderbookPage**(): _Element‹›_

Defined in components/pages/OrderbookPage.tsx:4

**Returns:** _Element‹›_

---

### `Const` Propose

▸ **Propose**(): _Element‹›_

Defined in components/forms/Propose.tsx:16

**Returns:** _Element‹›_

---

### `Const` RadioButton

▸ **RadioButton**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/forms/RadioButton.tsx:12

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Row

▸ **Row**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/orderbook/Row.tsx:10

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Spinner

▸ **Spinner**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/Spinner.tsx:9

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` SubmitButton

▸ **SubmitButton**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/forms/SubmitButton.tsx:9

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Table

▸ **Table**(`props`: [Props](globals.md#props)): _Element‹›_

Defined in components/orderbook/Table.tsx:14

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` TradingPage

▸ **TradingPage**(): _Element‹›_

Defined in components/pages/TradingPage.tsx:9

**Returns:** _Element‹›_

---

### askUser

▸ **askUser**(`read`: Interface, `str`: string): _Promise‹string›_

Defined in cli/util.ts:9

Get input from stdin

**Parameters:**

| Name   | Type      | Description                 |
| ------ | --------- | --------------------------- |
| `read` | Interface | -                           |
| `str`  | string    | A question to ask the user. |

**Returns:** _Promise‹string›_

answer from the user

---

### `Const` fakeKey

▸ **fakeKey**(`length`: number, `network`: string): _string_

Defined in util.ts:3

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `length`  | number |
| `network` | string |

**Returns:** _string_

---

### getAccount

▸ **getAccount**(`privateKey`: string, `node`: string, `network`: string): _Promise‹string›_

Defined in pkg/bitshares/util.ts:4

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `privateKey` | string |
| `node`       | string |
| `network`    | string |

**Returns:** _Promise‹string›_

---

### getAddress

▸ **getAddress**(`processArgv`: string[]): _void_

Defined in pkg/address/getAddress.ts:8

Get address pair and print to stdout

**Parameters:**

| Name          | Type     | Description         |
| ------------- | -------- | ------------------- |
| `processArgv` | string[] | The argument array. |

**Returns:** _void_

---

### getBTCAddress

▸ **getBTCAddress**(`network`: string): _[BTCAddress](interfaces/btcaddress.md)_

Defined in pkg/address/address.ts:29

A function for generating a random Bitcoin address with its corresponding private key

**Parameters:**

| Name      | Type   | Description                               |
| --------- | ------ | ----------------------------------------- |
| `network` | string | A string with the requested network type. |

**Returns:** _[BTCAddress](interfaces/btcaddress.md)_

A BTCAddress interface with a privatekey/address pair.

---

### getBTSAddress

▸ **getBTSAddress**(`network`: string): _[BTSAddress](interfaces/btsaddress.md)_

Defined in pkg/address/address.ts:63

A function for generating a random Bitshares address (PublicKey) with its corresponding private key

**Parameters:**

| Name      | Type   | Description                               |
| --------- | ------ | ----------------------------------------- |
| `network` | string | A string with the requested network type. |

**Returns:** _[BTSAddress](interfaces/btsaddress.md)_

An Address interface with a private key and address.

---

### getSecret

▸ **getSecret**(): _[Secret](interfaces/secret.md)_

Defined in pkg/secret/secret.ts:18

A function for generating and hashing a crypto random string with a length of 32.
The length of the secret can not be changed!

**Returns:** _[Secret](interfaces/secret.md)_

An Secret object.

---

### getUserInput

▸ **getUserInput**(`read`: Interface): _Promise‹[ACCSFields](interfaces/accsfields.md)›_

Defined in cli/getUserInput.ts:13

Get user input from stdin and store everything in a fields object.

**Parameters:**

| Name   | Type      |
| ------ | --------- |
| `read` | Interface |

**Returns:** _Promise‹[ACCSFields](interfaces/accsfields.md)›_

The raw user input fields object.

---

### `Const` hash

▸ **hash**(`s`: string): _string_

Defined in util.ts:16

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `s`  | string |

**Returns:** _string_

---

### isValidBitcoinPrivateKey

▸ **isValidBitcoinPrivateKey**(`privateKey`: string, `network`: string): _boolean_

Defined in pkg/address/validator.ts:1

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `privateKey` | string |
| `network`    | string |

**Returns:** _boolean_

---

### isValidBitcoinPublicKey

▸ **isValidBitcoinPublicKey**(`publicKey`: string): _boolean_

Defined in pkg/address/validator.ts:17

**Parameters:**

| Name        | Type   |
| ----------- | ------ |
| `publicKey` | string |

**Returns:** _boolean_

---

### isValidBitsharesPrivateKey

▸ **isValidBitsharesPrivateKey**(`privateKey`: string): _boolean_

Defined in pkg/address/validator.ts:21

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `privateKey` | string |

**Returns:** _boolean_

---

### `Const` orderFactory

▸ **orderFactory**(`count`: number): _[Order](interfaces/order.md)[]_

Defined in components/orderbook/Orderbook.tsx:46

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `count` | number |

**Returns:** _[Order](interfaces/order.md)[]_

---

### `Const` toPublicKey

▸ **toPublicKey**(`privateKey`: string): _string_

Defined in util.ts:20

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `privateKey` | string |

**Returns:** _string_

---

### witnessStackToScriptWitness

▸ **witnessStackToScriptWitness**(`witness`: Buffer[]): _Buffer_

Defined in pkg/bitcoin/htlc/witnessStack.ts:10

Helperfunction to serialize the final witness script

**Parameters:**

| Name      | Type     | Description |
| --------- | -------- | ----------- |
| `witness` | Buffer[] |             |

**Returns:** _Buffer_

## Object literals

### `Const` status

### ▪ **status**: _object_

Defined in components/orderbook/Orderbook.tsx:14

▪ **active**: _object_

Defined in components/orderbook/Orderbook.tsx:15

- **color**: _string_ = "teal"

- **label**: _string_ = "active"

▪ **expired**: _object_

Defined in components/orderbook/Orderbook.tsx:23

- **color**: _string_ = "gray"

- **label**: _string_ = "expired"

▪ **fulfilled**: _object_

Defined in components/orderbook/Orderbook.tsx:19

- **color**: _string_ = "gray"

- **label**: _string_ = "fulfilled"
