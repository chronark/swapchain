import React from "react"
import Orderbook, { orderFactory } from "./components/orderbook/Orderbook"

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-20">
        <Orderbook orders={orderFactory(7)}></Orderbook>
      </div>
    </div>
  )
}

export default App
