import React from "react"
import { Order } from "./Orderbook"
import { Row } from "./Row"


type Props = {
    orders: Order[],
    onRowClick: (order: Order) => void
}


export const Table = (props: Props) => {
    const {orders, onRowClick} = props
    return (
        <div className="w-full bg-white ">
             <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <h2 className="p-6 text-2xl text-gray-700">
                        Orderbook</h2>
                    <span className="px-2 text-sm text-gray-700 bg-gray-200 rounded-sm">{orders.length}</span>
                </div>

            </div>
            <table className="min-w-full table-auto">
                <thead className="border-b border-gray-300">
                    <tr>
                        
                        {["Created", "Status", "Amount you pay", "Rate"].map(heading => {
                            return (<th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-white-100">
                                {heading}
                            </th>)
                        })}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {orders.map((order) => {
                        return (
                            <Row order={order} onClick={onRowClick}></Row>
                        )
                    })}
                </tbody>
            </table>

        </div>
    )
}