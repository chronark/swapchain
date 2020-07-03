import React from "react"

type Props = {
    children: any
}

export const ComponentPage = (props:Props) => {
    return (
        <div className="container py-10 mx-auto mt-10">
          <main className="pb-10 mx-auto bg-white rounded shadow-sm bg-gray-100p-4 sm:px-6 lg:px-8">

             {props.children}
          </main>
        </div>
    )
}