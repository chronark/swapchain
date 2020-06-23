import React from "react"
import Orderbook, { Order } from "./Orderbook"
import renderer from "react-test-renderer"

jest.spyOn(Math, "random").mockImplementation(() => 1)
jest.spyOn(Date.prototype, "toLocaleString").mockImplementation(() => "IAmADate")
jest.spyOn(Date.prototype, "toLocaleTimeString").mockImplementation(() => "IAmADate")

it("renders correctly", () => {
  const order: Order = {
    selected: true,
    addressHash: "asdf",
    created: new Date(),
    validUntil: new Date(),
    status: { label: "label", color: "red" },
    give: {
      asset: "BTC",
      value: 1,
    },
    exchangeRate: 1,
    receive: {
      asset: "BTS",
      value: 1,
    },
  }

  const orders = []
  for (let i = 0; i < 10; i++) {
    orders.push(order)
  }

  const tree = renderer.create(<Orderbook orders={orders}></Orderbook>).toJSON()
  expect(tree).toMatchSnapshot()
})
