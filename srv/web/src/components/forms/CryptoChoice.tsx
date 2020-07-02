import React from "react"

type Props = {
    label: string
    name: string
    selected: boolean
}

export const CryptoChoice = (props: Props) => {
    const { label, name, selected } = props
    return (
        <div className={`flex justify-between items-center border rounded ${selected ? "border-teal-400 shadow" : "border-gray-200 bg-gray-100"}`}>

            <div className="flex flex-col items-start p-4">

                <span className={`text-left font-bold ${selected ? "text-gray-900" : "text-gray-500"}`}>
                    {name}
                </span>
                <p className={`text-sm text-left text-gray-600 ${selected ? "" : "opacity-0"}`}>
                    You are giving {name} away.
                </p>
            </div>
            <div className={`m-4 text-3xl font-bold hidden md:block ${selected ? "text-gray-900 " : "text-gray-300"}`}>
                {label}
            </div>

        </div >
    )

}