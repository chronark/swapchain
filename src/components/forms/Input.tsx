import React from "react"

type Props = {
  placeholder: string
  type: string
  name: string
  value?: string | number
  max?: number
  min?: number
  step?: number
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

export const Input = (props: Props) => {
  const css =
    "w-full py-3 font-mono text-center text-gray-700 bg-gray-100 border border-gray-200 rounded focus:bg-white focus:border-teal-400"

  if (props.type === "number") {
    return (
      <input
        required
        max={props.max}
        min={props.min}
        step={props.step}
        name={props.name}
        value={props.value || ""}
        onChange={props.onChange}
        className={css}
        type={props.type}
        placeholder={props.placeholder}
      ></input>
    )
  }
  return (
    <input
      required
      name={props.name}
      value={props.value || ""}
      onChange={props.onChange}
      className={css}
      type="text"
      placeholder={props.placeholder}
    ></input>
  )
}
