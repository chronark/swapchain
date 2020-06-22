import React from "react"
import { Order } from "./Orderbook"

type Props = {
    order: Order,
    onClick: (order: Order) => void
}


export const Row = (props: Props) => {
    const { order, onClick } = props


    return (
        <tr onClick={() => onClick(order)} className={`border-l-2 border-transparent hover:bg-gray-100 hover:border-gray-400 ${order.selected ? "bg-gray-100 border-l-4 border-gray-400" : ""}`}>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex flex-col text-sm leading-5">
                    <span className="text-gray-700">
                        {order.created.toLocaleTimeString()}
                    </span>
                    <span className="text-xs text-gray-500">
                        {order.created.toLocaleString("default", { day: "numeric", month: "short" })}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-left whitespace-no-wrap border-b border-gray-200">
                <span className={`px-2 text-xs uppercase font-semibold rounded-sm bg-${order.status.color}-100 text-${order.status.color}-800`}>
                    {order.status.label}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                    <span className="inline-flex px-2 text-xs font-semibold uppercase bg-gray-300 rounded-sm ">
                        {order.give.asset}

                    </span>
                    <span className="ml-2 font-mono leading-5 text-gray-500">
                        {order.give.value}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                    <span className="flex items-center ml-2 leading-5 text-gray-500" >
                        {order.exchangeRate.toFixed(5)}
                        <div className="flex flex-col ml-4 text-xs tracking-tight text-gray-500">
                            <span>{order.receive.asset}</span>
                            <div className="border-t border-gray-400 "></div>
                            <span>{order.give.asset}</span>
                        </div>
                    </span>
                </div>
            </td>
        </tr>
    )
}