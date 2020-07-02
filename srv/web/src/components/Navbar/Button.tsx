import React from "react"

type Props = {
    label: string
    href: string
}

export const Button = (props: Props) => {
    return (
        <a href={props.href} className="p-6 font-medium text-gray-700 transition duration-300 ease-in-out border-transparent hover:text-teal-900 md:border-b-2 hover:border-teal-600 focus:outline-none">{props.label}</a>

    )

}


