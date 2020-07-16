import React, { ReactElement } from "react"
interface Props {
  main: ReactElement
  footer: ReactElement
}

export const Form = (props: Props) => {
  return (
    <div className="flex flex-col items-center w-full bg-white border rounded shadow-lg">
      <div className="flex flex-col justify-center w-full p-4 space-y-4">{props.main}</div>
      <footer className="flex justify-center w-full p-4 bg-gray-100 border-t border-gray-200">{props.footer}</footer>
    </div>
  )
}
