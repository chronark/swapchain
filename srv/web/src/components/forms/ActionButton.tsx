import React from "react"

type Props = {
    color: string
    onClick: () => void
}

export const ActionButton = (props: Props) => {
    const color =`bg-${props.color}-100 border-${props.color}-400`
    


    return (
        <button onClick={props.onClick} className={`${color} inline-flex px-8 py-3 font-semibold text-gray-900 uppercase transition duration-200 ease-in-out focus:outline-none border border-b-4 rounded-sm hover:bg-white`}>
            Cancel Order
        </button>
    )
}