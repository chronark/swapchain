import React, { ReactElement } from "react"

type Props = {
    borderColor: string
    onClick: () => void
    label: string | ReactElement
}

export const SubmitButton = (props: Props) => {
    const borderColor = "border-" + props.borderColor + "-400"
  
    return (
        <button type="button" onClick={props.onClick} className={`px-8 py-3 font-semibold text-gray-900 uppercase transition duration-200 ease-in-out bg-white border rounded-sm shadow-sm focus:outline-none hover:border-teal-500 hover:bg-white ${borderColor}`}>
            {props.label}
        </button>
    )
}