import React, { useState, useEffect } from "react"
import { fakeAddress } from "../../util"
import { Label } from "./Label"
import { Input } from "./Input"
import { ReactComponent as Annotation } from "../../icons/annotation.svg"
import { SubmitButton } from "./SubmitButton"

export const CancelOrder = () => {
    const [isValid, setValid] = useState(false)
    const [showError, setShowError] = useState(false)

    const [fields, setFields] = useState({
        privateKey: ""
    })

    // Validation
    useEffect(() => {
        const isValid = fields.privateKey !== ""
        setValid(isValid)
        if (isValid) {
            setShowError(false)
        }
    }, [fields])

    const updateField = (e: React.FormEvent<HTMLInputElement>) => {
        setFields({
            ...fields,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    const submitHandler = () => {
        if (!isValid) {
            setShowError(true)
            return
        }
        // TODO: @webersni
        console.log()
    }




    return (
        <form className="container mx-auto">

            <section className="max-w-lg mt-12">

                <div className="flex-grow ">
                    <Label label="Your private key"></Label>
                    <Input name="privateKey" value={fields.privateKey} onChange={updateField} type="text" placeholder={fakeAddress(30)}></Input>
                </div>

                <p className="mt-2 text-sm text-center text-gray-500">
                    Your private key will never leave your browser, it is only used to authorize this request. <a href="" className="relative text-xs text-blue-500">Read more in our docs. <Annotation className="absolute right-0 h-4 -mr-4"></Annotation> </a>
                </p>
            </section>


            <footer className="pt-12 mt-8 text-center border-t border-gray-300 f">
                <p className={`-mt-4 pb-4 text-red-500 text-sm ${showError ? "" : "hidden"}`}>Please fill in your private key</p>
                <SubmitButton color={isValid ? "teal" : "gray"} label="Cancel Order" onClick={submitHandler}></SubmitButton>


            </footer>
        </form>
    )
}