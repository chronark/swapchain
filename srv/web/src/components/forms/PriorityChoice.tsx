import React from "react"

type Props = {
    label: string
    description: string
    selected: boolean
}

export const PriorityChoice = (props: Props) => {
    const { label, description, selected } = props
    return (
        <div className={`flex justify-between items-center border rounded ${selected ? "border-teal-400 shadow" : "border-gray-200 bg-gray-100"}`}>

            <div className="flex flex-col items-start p-4">

                <span className={`text-left font-bold ${selected ? "text-gray-900" : "text-gray-500"}`}>
                    {label}
                </span>
                <p className={`text-sm text-left ${selected ? "text-gray-600" : "text-gray-500"}`}>
                    {description}
                </p>
            </div>
           

        </div >
    )

}