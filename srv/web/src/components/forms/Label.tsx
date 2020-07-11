import React from "react"

type Props = {
    label: string
}

export const Label = (props: Props) => {
    return (
        <label className="text-xs leading-4 tracking-wider text-gray-700 uppercase">
            {props.label}</label>
    )
}