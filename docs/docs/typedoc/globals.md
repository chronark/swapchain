---
id: "globals"
title: "swapchain documentation"
sidebar_label: "Globals"
---

[swapchain documentation](globals.md)

## Index

### Classes

- [Animal](classes/animal.md)

### Interfaces

- [ReqRes](interfaces/reqres.md)

### Variables

- [app](globals.md#const-app)
- [port](globals.md#const-port)

### Functions

- [greet](globals.md#greet)
- [handler](globals.md#const-handler)
- [mockExpress](globals.md#mockexpress)
- [mockFetch](globals.md#mockfetch)
- [toUpper](globals.md#const-toupper)

## Variables

### `Const` app

• **app**: _Express‹›_ = express()

_Defined in [srv/api/app.ts:4](https://github.com/chronark/swapchain/blob/b169d31/src/srv/api/app.ts#L4)_

_Defined in [srv/toUpper/server.ts:4](https://github.com/chronark/swapchain/blob/b169d31/src/srv/toUpper/server.ts#L4)_

---

### `Const` port

• **port**: _string | 3000_ = process.env.PORT || 3000

_Defined in [srv/api/index.ts:2](https://github.com/chronark/swapchain/blob/b169d31/src/srv/api/index.ts#L2)_

_Defined in [srv/toUpper/index.ts:2](https://github.com/chronark/swapchain/blob/b169d31/src/srv/toUpper/index.ts#L2)_

## Functions

### greet

▸ **greet**(`name`: string): _string_

_Defined in [greet.ts:7](https://github.com/chronark/swapchain/blob/b169d31/src/greet.ts#L7)_

Greets a user.

**Parameters:**

| Name   | Type   | Description                                  |
| ------ | ------ | -------------------------------------------- |
| `name` | string | The name of someone you would like to greet. |

**Returns:** _string_

A greeting directed at the given name.

---

### `Const` handler

▸ **handler**(`req`: express.Request, `res`: express.Response): _Promise‹void›_

_Defined in [srv/api/routes.ts:12](https://github.com/chronark/swapchain/blob/b169d31/src/srv/api/routes.ts#L12)_

handler takes the request body and makes a call to the toUpper service with it.

It will return toUpper's result and status code.

**Parameters:**

| Name  | Type             | Description                   |
| ----- | ---------------- | ----------------------------- |
| `req` | express.Request  | The incoming express Request  |
| `res` | express.Response | The outgoing express Response |

**Returns:** _Promise‹void›_

---

### mockExpress

▸ **mockExpress**(`payload`: Record‹string, string›): _[ReqRes](interfaces/reqres.md)_

_Defined in [mocks/mockExpress.ts:14](https://github.com/chronark/swapchain/blob/b169d31/src/mocks/mockExpress.ts#L14)_

Mocks a request and response to use in unit tests.

**Parameters:**

| Name      | Type                   | Description                          |
| --------- | ---------------------- | ------------------------------------ |
| `payload` | Record‹string, string› | Payload object for the POST request. |

**Returns:** _[ReqRes](interfaces/reqres.md)_

- {req, res} object

---

### mockFetch

▸ **mockFetch**(`code`: number, `payload`: string): _void_

_Defined in [mocks/mockFetch.ts:11](https://github.com/chronark/swapchain/blob/b169d31/src/mocks/mockFetch.ts#L11)_

Implements a mock for node-fetch

**Parameters:**

| Name      | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `code`    | number | Status code for the response |
| `payload` | string | A serialized object          |

**Returns:** _void_

---

### `Const` toUpper

▸ **toUpper**(`req`: express.Request, `res`: express.Response): _void_

_Defined in [srv/toUpper/routes.ts:10](https://github.com/chronark/swapchain/blob/b169d31/src/srv/toUpper/routes.ts#L10)_

toUpper transforms a string to upper case and returns it.

It will return a HTTP/400 error for empty strings or empty payloads.

**Parameters:**

| Name  | Type             | Description                   |
| ----- | ---------------- | ----------------------------- |
| `req` | express.Request  | The incoming express Request  |
| `res` | express.Response | The outgoing express Response |

**Returns:** _void_
