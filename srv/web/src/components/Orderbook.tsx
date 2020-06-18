import React from "react"
import crypto from "crypto-random-string"


export const status = {
    active: {
        label: "active",
        color: "green",
    },
    fulfilled: {
        label: "fulfilled",
        color: "gray",
    },
    expired: {
        label: "expired",
        color: "gray",
    },
}


export interface Order {
    address: string
    created: Date
    status: { label: string, color: string }
    give: {
        asset: string
        value: number
    }
    receive: {
        asset: string
        value: number
    }
}


export const orderFactory = (count: number): Order[] => {
    let orders: Order[] = []
    for (let i = 0; i < count; i++) {
        const rng = Math.random() >= 0.5
        orders.push({
            address: crypto({ length: 265, type: "base64" }),
            created: new Date(),
            status: (Math.random() > 0.5) ? status.active : (Math.random() > 0.5) ? status.fulfilled : status.expired,
            give: {
                asset: rng ? "BTC" : "BTS",
                value: Math.random() / 1_000,
            },
            receive: {
                asset: rng ? "BTS" : "BTC",
                value: Math.random() * 1_000,
            }
        })
    }

    return orders


}











type Props = {
    orders: Order[]
}


export default (props: Props) => {
    return (
        <div className="">
            <div className="">
                <div className="bg-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <h2 className="p-6 text-2xl  text-gray-700">
                                Orderbook</h2>
                            <span className="rounded-sm px-2 bg-gray-200 text-sm text-gray-700">{props.orders.length}</span>
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input className="block rounded-md border border-gray-400 pl-10 py-3 text-gray-900 placeholder-gray-600" placeholder="Address"></input>
                            </div>
                        </div>
                    </div>
                    <table className="min-w-full">
                        <thead className="border-b border-gray-400">
                            <tr>
                                <th className="px-6 py-3 bg-white-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Status
            </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Created
            </th> <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Give
            </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Receive
            </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">


                            {props.orders.map((order) => {
                                return (<tr>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                        <span className={`px-2 inline-flex text-xs uppercase font-semibold rounded-sm bg-${order.status.color}-100 text-${order.status.color}-800`}>
                                            {order.status.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                        <div className="text-sm leading-5 text-gray-900">
                                            {order.created.toLocaleString("default", { day: "numeric", month: "short" })}
                                        </div>
                                        <div className="text-sm leading-5 text-gray-500">
                                            {order.created.toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                        <div className="flex items-center">


                                            <span className="rounded-sm px-2 inline-flex text-xs uppercase font-semibold bg-gray-300 ">
                                                {order.give.asset}

                                            </span>
                                            <span className="ml-2 text-gray-500 leading-5">
                                                {order.give.value}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                        <div className="flex items-center">


                                            <span className="rounded-sm px-2 inline-flex text-xs uppercase font-semibold bg-gray-300 ">
                                                {order.receive.asset}

                                            </span>
                                            <span className="ml-2 text-gray-500 leading-5">
                                                {order.receive.value}
                                            </span>
                                        </div>
                                    </td>
                                </tr>)
                            })}



                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}