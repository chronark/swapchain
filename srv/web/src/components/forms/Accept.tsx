import React, { useState, useEffect } from "react"
import { fakeAddress } from "../../util"
import { Label } from "./Label"
import { Input } from "./Input"
import { SubmitButton } from "./SubmitButton"
import { Form } from "./Form"

export const Accept = () => {
    const [fields, setFields] = useState({
        bitcoinPrivateKey: "",
        bitsharesPrivateKey: "",
        hash: "",
        counterpartyBitcoinPublicKey: "",
        counterpartyBitsharesAccount: ""
    })
    const [isValid, setValid] = useState(false)
    const [showError, setShowError] = useState(false)


    //validation
    useEffect(() => {
        const isValid = fields.bitcoinPrivateKey !== "" &&
            fields.bitsharesPrivateKey !== "" &&
            fields.counterpartyBitcoinPublicKey !== "" &&
            fields.counterpartyBitsharesAccount !== "" &&
            fields.hash !== ""


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
        console.log(fields)
    }
    return (
        <Form
            main={
                <div className="flex flex-col justify-center w-full p-8">
                    <h2 className="text-3xl font-bold leading-tight text-gray-800">Accept an Atomic Cross Chain Swap</h2>
                    <div className="flex flex-col mt-12 space-y-10">
                        <section>
                            <h2 className="text-xl font-bold leading-tight text-gray-800">Your Data</h2>
                            <div className="items-center justify-between mt-4 md:space-x-4 md:flex">

                                <div className="md:w-1/2">
                                    <Label label="Bitcoin private key"></Label>
                                    <Input
                                        name="bitcoinPrivateKey"
                                        onChange={updateField}
                                        placeholder={fakeAddress(30)}
                                        type="text"
                                        value={fields.bitcoinPrivateKey}
                                    ></Input>
                                </div>
                                <div className="md:w-1/2">
                                    <Label label="Bitshares private key"></Label>
                                    <Input
                                        name="bitsharesPrivateKey"
                                        onChange={updateField}
                                        placeholder=""
                                        type="text"
                                        value={fields.bitsharesPrivateKey}
                                    ></Input>
                                </div>
                            </div>
                            <p className="px-4 mx-auto mt-2 text-sm text-center text-gray-500">
                                Your public Bitcoin key and Bitshares account name can be calculated from your private key. Your private keys will never leave your browser, it is only used to sign your transactions. <a href="/" className="relative text-xs text-blue-500">Read more in our docs.</a>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold leading-tight text-gray-800">Counterparty Data</h2>
                            <div className="items-center justify-between mt-4 md:space-x-4 md:flex">

                                <div className="md:w-1/2">
                                    <Label label="Bitcoin public key"></Label>
                                    <Input
                                        name="counterpartyBitcoinPublicKey"
                                        onChange={updateField}
                                        placeholder={fakeAddress(30)}
                                        type="text"
                                        value={fields.counterpartyBitcoinPublicKey}
                                    ></Input>
                                </div>
                                <div className="md:w-1/2">
                                    <Label label="Bitshares account name"></Label>
                                    <Input
                                        name="counterpartyBitsharesAccount"
                                        onChange={updateField}
                                        placeholder=""
                                        type="text"
                                        value={fields.counterpartyBitsharesAccount}
                                    ></Input>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="block">
                                <Label label="Hash from Counterparty"></Label>
                                <Input name="hash" value={fields.hash} onChange={updateField} type="text" placeholder="Please enter the hash you received from your trading partner"></Input>
                            </div>

                        </section>
                    </div>
                </div>
            }
            footer={
                <div>
                    <p className={`-mt-4 pb-4 text-red-500 text-sm ${showError ? "" : "hidden"}`}>Please fill in all fields</p>
                    <SubmitButton color={isValid ? "teal" : "gray"} label="Submit" onClick={submitHandler}></SubmitButton>
                </div>
            }></Form>
    )
}