import React from "react"

type Props = {
    placeholder: string
    type: string
}

export const Input = (props:Props) => {
    return (
        <input className="w-full py-3 font-mono text-center text-gray-700 bg-gray-100 border border-gray-200 rounded focus:bg-white focus:border-teal-400" type={props.type} placeholder={props.placeholder}>
        </input>

    )
}