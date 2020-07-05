import React from "react"

type Props = {
    hint?: string
    tag?: string
    name: string
    description?: string
    selected: boolean
}

export const RadioButton = (props: Props) => {
    let { tag, name, selected, description, hint } = props
    return (
        <div className={`relative flex justify-between items-center border rounded ${selected ? "border-teal-400 shadow" : "border-gray-200 bg-gray-100"}`}>
            <div className="flex flex-col items-start p-4">
                <span className={`text-left font-bold ${selected ? "text-gray-900" : "text-gray-600"}`}>
                    {name}
                </span>
                <p className={`text-sm text-left ${selected ? "text-gray-600" : "text-gray-400"}`}>
                    {description}
                </p>
            </div>
            <div className="flex flex-col items-center justify-center">
                <span className="p-1 m-1 text-xs font-thin text-gray-500">{hint}</span>
                <span className={`mb-4 mr-4 text-3xl font-bold hidden md:block ${selected ? "text-gray-900 " : "text-gray-300"}`}>
                    {tag}
                </span>
            </div>
        </div>

    )

}