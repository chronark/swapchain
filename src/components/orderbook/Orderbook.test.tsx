import React from "react"
import { Orderbook, Order, orderFactory } from "./Orderbook"
import renderer from "react-test-renderer"

jest.spyOn(Math, "random").mockImplementation(() => 1)
jest.spyOn(Date.prototype, "toLocaleString").mockImplementation(() => "IAmADate")
jest.spyOn(Date.prototype, "toLocaleTimeString").mockImplementation(() => "IAmADate")

it("renders correctly", () => {
  const order: Order = {
    selected: true,
    addressHash: "asdf",
    created: new Date(1),
    validUntil: new Date(1),
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

describe("orderFactory()", () => {
  it("returns a new order", () => {
    const order = orderFactory(1)[0]
    expect(order.selected).toBe(false)
    expect(order.addressHash.length).toBe(64)
    expect(order.status.label.length > 0).toBe(true)
    expect(order.status.color.length > 0).toBe(true)
    expect(order.give.asset.length > 0).toBe(true)
    expect(order.give.value > 0).toBe(true)
    expect(order.exchangeRate > 0).toBe(true)
    expect(order.receive.asset.length > 0).toBe(true)
    expect(order.receive.value > 0).toBe(true)
  })
})
