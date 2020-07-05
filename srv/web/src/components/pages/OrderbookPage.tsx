import React, { useState } from "react"

import {Orderbook, orderFactory} from "../orderbook/Orderbook"


export const OrderbookPage = () => {

    const [orders, setOrders] = useState(orderFactory(7))

    return (
        <Orderbook orders={orders}></Orderbook>
    )



}