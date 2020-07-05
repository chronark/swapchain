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
            className={`focus:outline-none px-2 py-1 mx-2 text-xs font-semibold border border-transparent  uppercase  rounded hover:bg-gray-300 hover:text-gray-900 text-gray-800 ${active ? "border-teal-500 bg-teal-100" : "bg-gray-100"}`}>
            {label}
        </button>
    )








}