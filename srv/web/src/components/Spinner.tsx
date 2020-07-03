import React from "react"

import gif from "../icons/spinner.gif"

type Props = {
    className?: string
}

export const Spinner = (props: Props) => {
    return (
        <img className={props.className} src={gif} />
    )
}