---
id: "globals"
title: "swapchain documentation"
sidebar_label: "Globals"
---

[swapchain documentation](globals.md)

## Index

### Enumerations

- [Currency](enums/currency.md)
- [Network](enums/network.md)
- [Priority](enums/priority.md)
- [State](enums/state.md)

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
- [errorHandler](globals.md#errorhandler)
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

_Defined in [components/forms/RadioButton.tsx:3](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/RadioButton.tsx#L3)_

_Defined in [components/forms/Label.tsx:3](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/Label.tsx#L3)_

_Defined in [components/forms/Input.tsx:3](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/Input.tsx#L3)_

_Defined in [components/forms/SubmitButton.tsx:3](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/SubmitButton.tsx#L3)_

_Defined in [components/forms/Form.tsx:2](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/Form.tsx#L2)_

_Defined in [components/util/Spinner.tsx:5](https://github.com/chronark/swapchain/blob/6beff0a/src/components/util/Spinner.tsx#L5)_

_Defined in [components/util/ComponentPage.tsx:3](https://github.com/chronark/swapchain/blob/6beff0a/src/components/util/ComponentPage.tsx#L3)_

_Defined in [components/orderbook/Row.tsx:4](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Row.tsx#L4)_

_Defined in [components/orderbook/Table.tsx:8](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Table.tsx#L8)_

_Defined in [components/util/Modal.tsx:3](https://github.com/chronark/swapchain/blob/6beff0a/src/components/util/Modal.tsx#L3)_

_Defined in [components/orderbook/FilterButton.tsx:3](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/FilterButton.tsx#L3)_

_Defined in [components/orderbook/Orderbook.tsx:75](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Orderbook.tsx#L75)_

#### Type declaration:

- **orders**: _[Order](interfaces/order.md)[]_

### `Optional` bg

• **bg**? : _undefined | string_

_Defined in [components/util/ComponentPage.tsx:6](https://github.com/chronark/swapchain/blob/6beff0a/src/components/util/ComponentPage.tsx#L6)_

### children

• **children**: _any_

_Defined in [components/util/ComponentPage.tsx:5](https://github.com/chronark/swapchain/blob/6beff0a/src/components/util/ComponentPage.tsx#L5)_

### footer

• **footer**: _ReactElement_

_Defined in [components/forms/Form.tsx:4](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/Form.tsx#L4)_

### main

• **main**: _ReactElement_

_Defined in [components/forms/Form.tsx:3](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/Form.tsx#L3)_

### `Optional` title

• **title**? : _undefined | string_

_Defined in [components/util/ComponentPage.tsx:4](https://github.com/chronark/swapchain/blob/6beff0a/src/components/util/ComponentPage.tsx#L4)_

## Functions

### `Const` Accept

▸ **Accept**(): _Element‹›_

_Defined in [components/pages/Accept.tsx:21](https://github.com/chronark/swapchain/blob/6beff0a/src/components/pages/Accept.tsx#L21)_

**Returns:** _Element‹›_

---

### `Const` App

▸ **App**(): _Element‹›_

_Defined in [App.tsx:11](https://github.com/chronark/swapchain/blob/6beff0a/src/App.tsx#L11)_

**Returns:** _Element‹›_

---

### `Const` ComponentPage

▸ **ComponentPage**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/util/ComponentPage.tsx:9](https://github.com/chronark/swapchain/blob/6beff0a/src/components/util/ComponentPage.tsx#L9)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` FilterButton

▸ **FilterButton**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/orderbook/FilterButton.tsx:8](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/FilterButton.tsx#L8)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Form

▸ **Form**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/forms/Form.tsx:7](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/Form.tsx#L7)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Input

▸ **Input**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/forms/Input.tsx:14](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/Input.tsx#L14)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Label

▸ **Label**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/forms/Label.tsx:7](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/Label.tsx#L7)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` LandingPage

▸ **LandingPage**(): _Element‹›_

_Defined in [components/pages/LandingPage.tsx:4](https://github.com/chronark/swapchain/blob/6beff0a/src/components/pages/LandingPage.tsx#L4)_

**Returns:** _Element‹›_

---

### `Const` Modal

▸ **Modal**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/util/Modal.tsx:10](https://github.com/chronark/swapchain/blob/6beff0a/src/components/util/Modal.tsx#L10)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Navbar

▸ **Navbar**(): _Element‹›_

_Defined in [components/Navbar/Navbar.tsx:6](https://github.com/chronark/swapchain/blob/6beff0a/src/components/Navbar/Navbar.tsx#L6)_

**Returns:** _Element‹›_

---

### `Const` Orderbook

▸ **Orderbook**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/orderbook/Orderbook.tsx:79](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Orderbook.tsx#L79)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` OrderbookPage

▸ **OrderbookPage**(): _Element‹›_

_Defined in [components/pages/OrderbookPage.tsx:4](https://github.com/chronark/swapchain/blob/6beff0a/src/components/pages/OrderbookPage.tsx#L4)_

**Returns:** _Element‹›_

---

### `Const` Propose

▸ **Propose**(): _Element‹›_

_Defined in [components/pages/Propose.tsx:21](https://github.com/chronark/swapchain/blob/6beff0a/src/components/pages/Propose.tsx#L21)_

**Returns:** _Element‹›_

---

### `Const` RadioButton

▸ **RadioButton**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/forms/RadioButton.tsx:12](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/RadioButton.tsx#L12)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Row

▸ **Row**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/orderbook/Row.tsx:9](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Row.tsx#L9)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Spinner

▸ **Spinner**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/util/Spinner.tsx:9](https://github.com/chronark/swapchain/blob/6beff0a/src/components/util/Spinner.tsx#L9)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` SubmitButton

▸ **SubmitButton**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/forms/SubmitButton.tsx:9](https://github.com/chronark/swapchain/blob/6beff0a/src/components/forms/SubmitButton.tsx#L9)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` Table

▸ **Table**(`props`: [Props](globals.md#props)): _Element‹›_

_Defined in [components/orderbook/Table.tsx:13](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Table.tsx#L13)_

**Parameters:**

| Name    | Type                      |
| ------- | ------------------------- |
| `props` | [Props](globals.md#props) |

**Returns:** _Element‹›_

---

### `Const` TradingPage

▸ **TradingPage**(): _Element‹›_

_Defined in [components/pages/TradingPage.tsx:9](https://github.com/chronark/swapchain/blob/6beff0a/src/components/pages/TradingPage.tsx#L9)_

**Returns:** _Element‹›_

---

### errorHandler

▸ **errorHandler**(`message`: string): _void_

_Defined in [cli/getUserInput.ts:227](https://github.com/chronark/swapchain/blob/6beff0a/src/cli/getUserInput.ts#L227)_

An errorhandler for errors in CLI.

**Parameters:**

| Name      | Type   | Description           |
| --------- | ------ | --------------------- |
| `message` | string | The message to print. |

**Returns:** _void_

---

### `Const` fakeKey

▸ **fakeKey**(`length`: number, `network?`: undefined | string): _string_

_Defined in [pkg/util/util.ts:3](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/util/util.ts#L3)_

**Parameters:**

| Name       | Type                    |
| ---------- | ----------------------- |
| `length`   | number                  |
| `network?` | undefined &#124; string |

**Returns:** _string_

---

### getAccount

▸ **getAccount**(`privateKey`: string, `node`: string, `network`: string): _Promise‹string›_

_Defined in [pkg/bitshares/util.ts:4](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitshares/util.ts#L4)_

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

_Defined in [pkg/address/getAddress.ts:8](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/address/getAddress.ts#L8)_

Get address pair and print to stdout

**Parameters:**

| Name          | Type     | Description         |
| ------------- | -------- | ------------------- |
| `processArgv` | string[] | The argument array. |

**Returns:** _void_

---

### getBTCAddress

▸ **getBTCAddress**(`network`: string): _[BTCAddress](interfaces/btcaddress.md)_

_Defined in [pkg/address/address.ts:29](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/address/address.ts#L29)_

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

_Defined in [pkg/address/address.ts:63](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/address/address.ts#L63)_

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

_Defined in [pkg/secret/secret.ts:18](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/secret/secret.ts#L18)_

A function for generating and hashing a crypto random string with a length of 32.
The length of the secret can not be changed!

**Returns:** _[Secret](interfaces/secret.md)_

An Secret object.

---

### getUserInput

▸ **getUserInput**(): _Promise‹[ACCSFields](interfaces/accsfields.md)›_

_Defined in [cli/getUserInput.ts:13](https://github.com/chronark/swapchain/blob/6beff0a/src/cli/getUserInput.ts#L13)_

Get user input from JSON config file or stdin and store everything in a fields object.

**Returns:** _Promise‹[ACCSFields](interfaces/accsfields.md)›_

The raw user input fields object.

---

### `Const` hash

▸ **hash**(`s`: string): _string_

_Defined in [pkg/util/util.ts:14](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/util/util.ts#L14)_

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `s`  | string |

**Returns:** _string_

---

### isValidBitcoinPrivateKey

▸ **isValidBitcoinPrivateKey**(`privateKey`: string, `network`: string): _boolean_

_Defined in [pkg/address/validator.ts:1](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/address/validator.ts#L1)_

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `privateKey` | string |
| `network`    | string |

**Returns:** _boolean_

---

### isValidBitcoinPublicKey

▸ **isValidBitcoinPublicKey**(`publicKey`: string): _boolean_

_Defined in [pkg/address/validator.ts:17](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/address/validator.ts#L17)_

**Parameters:**

| Name        | Type   |
| ----------- | ------ |
| `publicKey` | string |

**Returns:** _boolean_

---

### isValidBitsharesPrivateKey

▸ **isValidBitsharesPrivateKey**(`privateKey`: string): _boolean_

_Defined in [pkg/address/validator.ts:21](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/address/validator.ts#L21)_

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `privateKey` | string |

**Returns:** _boolean_

---

### `Const` orderFactory

▸ **orderFactory**(`count`: number): _[Order](interfaces/order.md)[]_

_Defined in [components/orderbook/Orderbook.tsx:46](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Orderbook.tsx#L46)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `count` | number |

**Returns:** _[Order](interfaces/order.md)[]_

---

### `Const` toPublicKey

▸ **toPublicKey**(`privateKey`: string): _string_

_Defined in [pkg/util/util.ts:18](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/util/util.ts#L18)_

**Parameters:**

| Name         | Type   |
| ------------ | ------ |
| `privateKey` | string |

**Returns:** _string_

---

### witnessStackToScriptWitness

▸ **witnessStackToScriptWitness**(`witness`: Buffer[]): _Buffer_

_Defined in [pkg/bitcoin/htlc/witnessStack.ts:10](https://github.com/chronark/swapchain/blob/6beff0a/src/pkg/bitcoin/htlc/witnessStack.ts#L10)_

Helperfunction to serialize the final witness script

**Parameters:**

| Name      | Type     | Description |
| --------- | -------- | ----------- |
| `witness` | Buffer[] |             |

**Returns:** _Buffer_

## Object literals

### `Const` status

### ▪ **status**: _object_

_Defined in [components/orderbook/Orderbook.tsx:14](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Orderbook.tsx#L14)_

▪ **active**: _object_

_Defined in [components/orderbook/Orderbook.tsx:15](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Orderbook.tsx#L15)_

- **color**: _string_ = "teal"

- **label**: _string_ = "active"

▪ **expired**: _object_

_Defined in [components/orderbook/Orderbook.tsx:23](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Orderbook.tsx#L23)_

- **color**: _string_ = "gray"

- **label**: _string_ = "expired"

▪ **fulfilled**: _object_

_Defined in [components/orderbook/Orderbook.tsx:19](https://github.com/chronark/swapchain/blob/6beff0a/src/components/orderbook/Orderbook.tsx#L19)_

- **color**: _string_ = "gray"

- **label**: _string_ = "fulfilled"
