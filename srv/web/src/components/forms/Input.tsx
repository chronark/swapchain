import React from "react"

type Props = {
    placeholder: string
    type: string,
    name: string,
    value?: string | number
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

export const Input = (props: Props) => {
    return (
        <input
            required
            name={props.name}
            value={props.value || ""}
            onChange={props.onChange}
            className="w-full py-3 font-mono text-center text-gray-700 bg-gray-100 border border-gray-200 rounded focus:bg-white focus:border-teal-400"
            type={props.type}
            placeholder={props.placeholder}>
        </input>

    )
}