import React from "react"

type Props = {
    name: string
    selected: boolean
}

export const NetworkChoice = (props: Props) => {
    const { name, selected } = props
    return (
        <div className={`flex flex-col p-4 items-start justify-between border rounded ${selected ? "border-teal-400 shadow" : "border-gray-200 bg-gray-100"}`}>
            <span className={`text-left font-bold ${selected ? "text-gray-900" : "text-gray-500"}`}>
                {name}
            </span>
            <p className={`text-sm text-left text-gray-600 ${selected ? "" : "opacity-0"}`}>
                You are about to trade on {name}.
            </p>
        </div>

    )

}