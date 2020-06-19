import React, { useState } from "react"
import crypto from "crypto-random-string"
import { Table } from "./Table"
import Modal from "./Modal"
import * as bitcoin from "bitcoinjs-lib"
import { ReactComponent as LeftArrow } from "../../icons/arrow-left.svg"

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
    selected: boolean,
    address: string
    created: Date
    validUntil: Date
    status: { label: string, color: string }
    give: {
        asset: string
        value: number
    }
    exchangeRate: number,
    receive: {
        asset: string
        value: number
    }
}

export const orderFactory = (count: number): Order[] => {
    let orders: Order[] = []
    for (let i = 0; i < count; i++) {
        const value = Number((Math.random() / 1_000).toFixed(10));
        const rng = Math.random()
        const validUntil = new Date(new Date().getTime() + 86_400_000 * (Math.random() - 0.1) * 7)
        orders.push({
            selected: false,
            address: bitcoin.crypto.sha256(Buffer.from(crypto({ length: 64, type: "base64" }))).toString(),
            created: new Date(),
            validUntil,
            status: (validUntil < new Date()) ? status.expired : (rng > 0.5) ? status.active : status.fulfilled,
            give: {
                asset: (rng > 0.5) ? "BTC" : "BTS",
                value: value,
            },
            exchangeRate: rng + 0.5,
            receive: {
                asset: (rng > 0.5) ? "BTS" : "BTC",
                value: value * (rng + 0.5),
            }
        })
    }

    orders[0].address = "abcd"

    return orders
}



type Props = {
    orders: Order[]
}


export default (props: Props) => {
    const { orders } = props
    const [modalOpen, setModalOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(orders[0])

    const selectOrder = (order: Order): void => {
        setSelectedOrder(order)
        setModalOpen(true)
    }


    return (


        <div className="flex">
            <nav className="p-4 bg-white border-r border-gray-400 w-max-sm">
                <div className="flex flex-col ">
                    <span className="px-4 py-2 text-xs font-medium leading-4 tracking-wider text-gray-700 uppercase ">Status</span>
                    <div>

                        {[status.active, status.expired, status.fulfilled].map(s => {
                            return (
                                <button className="px-2 py-1 mx-2 text-xs font-semibold text-gray-800 uppercase bg-gray-100 rounded-sm hover:bg-gray-300 hover:text-gray-900">{s.label}</button>
                            )
                        })}
                    </div>
                </div>
                <div className="mt-8">
                    <span className="px-4 py-2 text-xs font-medium leading-4 tracking-wider text-gray-700 uppercase ">Address</span>

                    <div className="relative ml-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input className="block py-3 pl-10 text-gray-900 placeholder-gray-600 border border-gray-400 rounded-md" placeholder="Address"></input>
                    </div>
                </div>

            </nav>
            <div className="flex-grow">

                <Table orders={orders} onRowClick={selectOrder} ></Table>

            </div>

            <Modal order={selectedOrder} open={modalOpen} close={() => setModalOpen(false)}></Modal>
        </div>
    )
}