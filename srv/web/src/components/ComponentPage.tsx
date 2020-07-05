import React from "react"
import { PromiseProvider } from "mongoose"

type Props = {
    title?: string
    children: any
}

export const ComponentPage = (props:Props) => {
    return (
        <div className="container py-10 mx-auto mt-10">
          <main className="pb-10 mx-auto bg-white rounded shadow-sm bg-gray-100p-4 sm:px-6 lg:px-8">
          <h1 className="py-4 text-3xl font-bold leading-tight text-gray-900">
               {props.title}</h1>
             {props.children}
          </main>
        </div>
    )
}