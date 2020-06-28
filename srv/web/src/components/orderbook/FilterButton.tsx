import React, { useState } from "react"

type Props = {
    onClick: (s: string) => void
    label: string
}

export const FilterButton = (props: Props) => {
    const { onClick, label } = props

    const [active, setActive] = useState(false)

    const toggle = () => {
        setActive(!active)
        onClick(label)

    }



    return (
        <button
            onClick={toggle}
            className={`focus:outline-none px-2 py-1 mx-2 text-xs font-semibold  uppercase  rounded hover:bg-gray-300 hover:text-gray-900 text-gray-800 ${active ? "bg-green-200" : "bg-gray-100"}`}>
            {label}
        </button>
    )








}