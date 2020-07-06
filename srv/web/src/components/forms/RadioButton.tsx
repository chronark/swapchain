import React from "react"

type Props = {
    hint?: string
    tag?: string
    name: string
    description?: string
    selected: boolean
    onClick?: () => void
}

export const RadioButton = (props: Props) => {
    let { tag, name, selected, description, hint, onClick } = props
    return (
        <button
            onClick={onClick}
            className={`focus:outline-none flex w-full justify-between border rounded ${selected ? "border-teal-400 shadow" : "bg-gray-100"}`}>
            <div className="flex flex-col items-start p-4">
                <div className="flex items-center justify-between w-full">

                    <span className={`text-left font-bold ${selected ? "text-gray-900" : "text-gray-600"}`}>
                        {name}
                    </span>
                    <span className={`text-xs font-thin ${selected ? "text-gray-600" : "text-gray-400"}`}>{hint}</span>
                </div>
                <p className={`text-sm text-left ${selected ? "text-gray-600" : "text-gray-400"}`}>
                    {description}
                </p>
            </div>
            <div className="flex items-center justify-center">
                <span className={`mr-4 text-3xl font-bold hidden md:block ${selected ? "text-gray-900 " : "text-gray-300"}`}>
                    {tag}
                </span>
            </div>
        </button>

    )

}