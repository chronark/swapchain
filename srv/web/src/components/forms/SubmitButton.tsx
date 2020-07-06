import React, { ReactElement } from "react"

type Props = {
    color: string
    onClick: () => void
    label: string | ReactElement
}

export const SubmitButton = (props: Props) => {
    const color =`bg-${props.color}-100 border-${props.color}-400`
    


    return (
        <button type="button" onClick={props.onClick} className={`${color} inline-flex px-8 py-3 font-semibold text-gray-900 uppercase transition duration-200 ease-in-out border focus:outline-none rounded-sm hover:bg-white`}>
            {props.label}
        </button>
    )
}