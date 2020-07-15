import React from "react"

interface Props {
  title?: string
  children: any
  bg?: string
}

export const ComponentPage = (props: Props) => {
  return (
    <div className="container mx-auto">
      <main className={`pb-10 mx-auto ${props.bg} ${props.bg ? "shadow-sm" : ""}  p-4 sm:px-6 lg:px-8`}>
        <h1 className="py-4 text-3xl font-semibold leading-tight text-gray-900">{props.title}</h1>
        {props.children}
      </main>
    </div>
  )
}
