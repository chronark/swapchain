import React, { useState } from "react"
import { Order } from "./Orderbook"
import { Row } from "./Row"
import { ReactComponent as ChevronDown } from "../../icons/chevron-down.svg"
import { ReactComponent as ChevronUp } from "../../icons/chevron-up.svg"
import { ReactComponent as Exclamation } from "../../icons/exclamation.svg"

type Props = {
    orders: Order[],
    onRowClick: (order: Order) => void
}


export const Table = (props: Props) => {
    const { orders, onRowClick } = props


    const [sortedByDate, setSortedByDate] = useState(0)
    const [sortedByRate, setSortedByRate] = useState(0)
    const [sortedByAmountYouPay, setSortedByAmountYouPay] = useState(0)


    const toggleSortByDate = () => {
        switch (sortedByDate) {
            case -1:
                orders.reverse()
                setSortedByDate(1)
                break;
            case 0:
                orders.sort((a: Order, b: Order) => { return b.created.getTime() - a.created.getTime() })
                setSortedByDate(1)
                break;
            case 1:
                orders.reverse()
                setSortedByDate(-1)
                break;

        }
    }
    const toggleSortByRate = () => {
        switch (sortedByRate) {
            case -1:
                orders.reverse()
                setSortedByRate(1)
                break;
            case 0:
                orders.sort((a: Order, b: Order) => { return b.exchangeRate - a.exchangeRate })
                setSortedByRate(1)
                break;
            case 1:
                orders.reverse()
                setSortedByRate(-1)
                break;

        }
    }
    const toggleSortByAmountYouPay = () => {
        switch (sortedByAmountYouPay) {
            case -1:
                orders.reverse()
                setSortedByAmountYouPay(1)
                break;
            case 0:
                orders.sort((a: Order, b: Order) => { return b.give.value - a.give.value })
                setSortedByAmountYouPay(1)
                break;
            case 1:
                orders.reverse()
                setSortedByAmountYouPay(-1)
                break;

        }
    }





    return (
        <div className="flex-grow min-w-full bg-white ">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <h2 className="p-6 text-2xl text-gray-700">Orderbook</h2>
                    <span className="px-2 text-sm text-gray-700 bg-gray-200 rounded">{orders.length}</span>
                </div>
                <div className={` flex items-center px-4 py-2 mr-8 bg-yellow-100 rounded transition duration-300 transform ease-in-out ${orders.length > 0 ? "opacity-0 translate-x-20" : "opacity-100"}`}>
                    <Exclamation className="w-4 h-4 text-orange-700"></Exclamation>
                    <span className="ml-3 text-xs font-bold text-orange-900">
                        Looks like there is nothing here, try removing some filters.
                        </span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full overflow-hidden">
                    <table className="min-w-full table-auto">
                        <thead className="border-b border-gray-300">
                            <tr>
                                < th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-white-100">
                                    <div className="flex">
                                        <span>Created</span>
                                        {sortedByDate === 1 ?
                                            <ChevronUp onClick={toggleSortByDate} className="w-4 h-4 ml-1 text-gray-600 hover:text-gray-900"></ChevronUp>
                                            :
                                            <ChevronDown onClick={toggleSortByDate} className="w-4 h-4 ml-1 text-gray-600 hover:text-gray-900"></ChevronDown>
                                        }
                                    </div>
                                </th>
                                <th className="flex px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-white-100">
                                    Status
                        </th>
                                <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-white-100">
                                    <div className="flex">
                                        <span>Amount You Pay</span>
                                        {sortedByRate === 1 ?
                                            <ChevronUp onClick={toggleSortByAmountYouPay} className="w-4 h-4 ml-1 text-gray-600 hover:text-gray-900"></ChevronUp>
                                            :
                                            <ChevronDown onClick={toggleSortByAmountYouPay} className="w-4 h-4 ml-1 text-gray-600 hover:text-gray-900"></ChevronDown>
                                        }
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-white-100">
                                    <div className="flex">
                                        <span>Rate</span>
                                        {sortedByRate === 1 ?
                                            <ChevronUp onClick={toggleSortByRate} className="w-4 h-4 ml-1 text-gray-600 hover:text-gray-900"></ChevronUp>
                                            :
                                            <ChevronDown onClick={toggleSortByRate} className="w-4 h-4 ml-1 text-gray-600 hover:text-gray-900"></ChevronDown>
                                        }
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {orders.map((order, key) => {
                                return (
                                    <Row key={key} order={order} onClick={onRowClick}></Row>
                                )
                            })}
                        </tbody>
                    </table>

                </div>
            </div >
        </div>
    )
}