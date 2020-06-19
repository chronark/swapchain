import React from "react"
import { Order } from "./Orderbook"
import { ReactComponent as X } from "../../icons/x.svg"
import { ReactComponent as ArrowRight } from "../../icons/arrow-narrow-right.svg"
import { ReactComponent as Refresh } from "../../icons/refresh.svg"

type Props = {
    close: () => void
    open: boolean,
    order: Order
}


export default (props: Props) => {
    const { open, close } = props
    return (
        <div className={open ? "" : "hidden"}>
       

        </div>
    )
}


