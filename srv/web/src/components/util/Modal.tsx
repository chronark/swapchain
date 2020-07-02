import React from "react"
import { ReactComponent as X } from "../../icons/x.svg"
type Props = {
    close: () => void
    open: boolean
    children: any
    title: string
}


export default (props: Props) => {
  
    return (
        <div className={props.open ? "" : "hidden"}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="p-12 bg-white rounded-sm">
                    <header className="flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-500">{props.title}</h1>
                        <X className="w-8 h-8 text-gray-400 duration-200 ease-in-out hover:text-gray-800" onClick={props.close}></X>
                    </header>
                    <div className="flex flex-col items-center justify-around md:flex-row ">
                    {props.children}
                </div>

            </div>
        </div>
        </div>
    )
}

