import React, { useState, useEffect } from "react"
import { ReactComponent as QRCode } from "../../icons/qrcode.svg"
import { Table } from "./Table"
import Modal from "./Modal"
import { FilterButton } from "./FilterButton"
import crypto from "crypto"








const hash = (s: string): string => {
    return crypto.createHash("SHA256").update(s).digest("hex")
}


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
    addressHash: string
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
            addressHash: hash(Math.random().toString()),
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

    orders[0].addressHash = hash("helloamos")
    orders[1].addressHash = hash("helloamos")


    return orders
}



type Props = {
    orders: Order[]
}


export default (props: Props) => {
    const { orders } = props
    const [modalOpen, setModalOpen] = useState(false)

    const [selectedOrder, setSelectedOrder] = useState(orders[0])

    const [statusFilter, setStatusFilter] = useState<string[]>([])
    const [assetFilter, setAssetFilter] = useState<string[]>([])
    const [addressFilter, setAddressFilter] = useState("")


    const [visibleOrders, setVisibleOrders] = useState(orders)


    useEffect(() => {
        // Create new list to filter in the following steps
        let filteredOrders = orders.map((x) => x)

        // Filter by status
        if (statusFilter.length > 0) {
            filteredOrders = filteredOrders.filter((order: Order) => {
                return statusFilter.includes(order.status.label)
            })
        }
        if (assetFilter.length > 0) {
            filteredOrders = filteredOrders.filter((order: Order) => {
                return assetFilter.includes(order.give.asset)
            })
        }
        if (addressFilter !== "") {
            filteredOrders = filteredOrders.filter((order: Order) => {
                return order.addressHash === hash(addressFilter)
            })
        }


        setVisibleOrders(filteredOrders)
    }, [statusFilter, addressFilter, assetFilter, orders])


    const selectOrder = (order: Order): void => {
        setSelectedOrder(order)
        setModalOpen(true)
    }

    const toggleStatusFilter = (label: string): void => {
        if (statusFilter.includes(label)) {
            setStatusFilter(statusFilter.filter((filter: string) => filter !== label))
        } else {
            setStatusFilter([...statusFilter, label])
        }
    }
    const toggleAssetFilter = (asset: string): void => {
        if (assetFilter.includes(asset)) {
            setAssetFilter(assetFilter.filter((filter: string) => filter !== asset))
        } else {
            setAssetFilter([...assetFilter, asset])
        }
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAddressFilter(e.currentTarget.value)
    }


    return (


        <div className="flex flex-col lg:flex-row">
            <nav className="justify-between flex-grow p-4 pb-10 bg-white border-b border-gray-400 lg:pb-0 lg:max-w-xs lg:border-r">
                <div>
                    <span className="px-4 py-2 text-xs font-medium leading-4 tracking-wider text-gray-700 uppercase ">Address</span>

                    <div className="relative mt-2 ml-4 ">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            <QRCode className="w-6 h-6 text-gray-600" ></QRCode>
                        </span>
                        <input className="block w-full py-1 pl-10 text-gray-900 placeholder-gray-600 border border-gray-400 rounded" placeholder={hash(Math.random().toString()).substring(0, 32) + "..."} onChange={handleAddressChange}></input>
                    </div>
                </div>
                <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row lg:flex-col lg:items-start">
                    <div className="mt-8">
                        <span className="px-4 py-2 text-xs font-medium leading-4 tracking-wider text-gray-700 uppercase ">Status</span>
                        <div className="mt-2 ml-2 ">

                            {[status.active, status.expired, status.fulfilled].map((s, k) => {
                                return (
                                    <FilterButton key={s.label + k} label={s.label} onClick={toggleStatusFilter}></FilterButton>
                                )
                            })}
                        </div>
                    </div>
                    <div className="mt-8">
                        <span className="px-4 py-2 text-xs font-medium leading-4 tracking-wider text-gray-700 uppercase">asset you pay</span>
                        <div className="mt-2 ml-2">

                            {["BTC", "BTS"].map((s, key) => {
                                return (
                                    <FilterButton key={key} label={s} onClick={toggleAssetFilter}></FilterButton>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </nav>
            <div className="flex flex-grow">
                <Table orders={visibleOrders} onRowClick={selectOrder} ></Table>
            </div>
            <Modal order={selectedOrder} open={modalOpen} close={() => setModalOpen(false)}></Modal>
        </div>
    )
}