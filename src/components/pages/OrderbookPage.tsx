import React from "react"
import { Orderbook, orderFactory } from "../orderbook/Orderbook"

export const OrderbookPage = () => {
  return <Orderbook orders={orderFactory(7)}></Orderbook>
}
