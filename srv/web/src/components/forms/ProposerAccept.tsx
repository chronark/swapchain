
import React, { useState, useEffect } from "react"
import { fakeAddress } from "../../util"
import { PriorityChoice } from "./PriorityChoice"
import { Label } from "./Label"
import { Input } from "./Input"
import { SubmitButton } from "./SubmitButton"
import { getSecret } from "../../pkg/secret/secret"

export const ProposerAccept = () => {

    enum Priority {
        HIGH,
        MEDIUM,
        LOW,
    }

    const [fields, setFields] = useState({
        bitcoinPublicAddress: "",
        bitcoinPrivateKey: "",
        bitsharesAccountName: "",
        bitsharesPrivateKey: "",
        priority: Priority.HIGH,
        secret: getSecret(),
    })
    const [isValid, setValid] = useState(false)
    const [showError, setShowError] = useState(false)
    const [accepted, setAccepted] = useState(false)

    //validation
    useEffect(() => {
        const isValid = fields.bitcoinPublicAddress !== "" &&
            fields.bitcoinPrivateKey !== "" &&
            fields.bitsharesAccountName !== "" &&
            fields.bitsharesPrivateKey !== ""

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
    const updateFieldByName = (name: string, value: number | string) => {
        setFields({
            ...fields,
            [name]: value
        })
    }

    const submitHandler = () => {
        if (!isValid) {
            setShowError(true)
            return
        }
        //TODO: @webersni

        setAccepted(true)
        console.log(fields)
    }

    return (
        <div className="container mx-auto">
            {accepted ?
                <div>

                    <section className="px-3 py-6">
                        <Label label="Your secret hash"></Label>
                        <p className="p-3 font-mono text-center text-teal-900 break-all border border-teal-400 rounded text-bold">{fields.secret.hash}</p>
                    </section>
                    <footer className="pt-12 mt-8 text-center border-t border-gray-300">
                        <p className="mt-3 text-sm text-gray-700">Copy this hash and give it to your trading partner</p>
                    </footer>
                </div>
                :
                <div>

                    <section className="mt-12 -mx-3 md:flex">
                        <div className="px-3 md:w-1/2">
                            <Label label="Bitcoin public address"></Label>
                            <Input name="bitcoinPublicAddress" value={fields.bitcoinPublicAddress} onChange={updateField} type="text" placeholder={fakeAddress(30)}></Input>
                        </div>
                        <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                            <Label label="Bitshares account name"></Label>
                            <Input name="bitsharesAccountName" value={fields.bitsharesAccountName} onChange={updateField} type="text" placeholder="amos"></Input>
                        </div>
                    </section>
                    <section className="mt-12 ">
                        <div className="-mx-3 md:flex">
                            <div className="px-3 md:w-1/2">
                                <Label label="Bitcoin private key"></Label>
                                <Input name="bitcoinPrivateKey" value={fields.bitcoinPrivateKey} onChange={updateField} type="text" placeholder={fakeAddress(30)}></Input>
                            </div>
                            <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                                <Label label="Bitshares private key"></Label>
                                <Input name="bitsharesPrivateKey" value={fields.bitsharesPrivateKey} onChange={updateField} type="text" placeholder={fakeAddress(30)}></Input>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-center text-gray-500 ">
                            Your private keys will never leave your browser, it is only used to sign your transactions. <a href="" className="relative text-xs text-blue-500">Read more in our docs.</a>
                        </p>
                    </section>
                    <section className="mt-12">
                        <Label label="Choose your priority"></Label>
                        <div className="flex flex-col items-center -mx-3 space-y-4 md:space-y-0 md:flex-row">
                            <button className="w-full px-3 md:w-1/3 focus:outline-none" onClick={() => updateFieldByName("priority", Priority.HIGH)}>
                                <PriorityChoice label={Priority[Priority.HIGH]} description="You pay the highest fees to increase the chance for your transaction to be picked up by the miners." selected={fields.priority === Priority.HIGH}></PriorityChoice>
                            </button>
                            <button className="w-full px-3 md:w-1/3 focus:outline-none" onClick={() => updateFieldByName("priority", Priority.MEDIUM)}>
                                <PriorityChoice label={Priority[Priority.MEDIUM]} description="You pay a moderate amount of fees so miners will probably confirm your transaction soon." selected={fields.priority === Priority.MEDIUM}></PriorityChoice>
                            </button>
                            <button className="w-full px-3 md:w-1/3 focus:outline-none" onClick={() => updateFieldByName("priority", Priority.LOW)}>
                                <PriorityChoice label={Priority[Priority.LOW]} description="You pay the lowest fees but might have to wait a few more blocks for your transaction to be confirmed." selected={fields.priority === Priority.LOW}></PriorityChoice>
                            </button>
                        </div>
                    </section>
                    <footer className="pt-12 mt-8 text-center border-t border-gray-300">
                        < p className={`-mt-4 pb-4 text-red-500 text-sm ${showError ? "" : "hidden"}`}>Please fill in all fields</p>
                        <SubmitButton color={isValid ? "teal" : "gray"} label="Submit" onClick={submitHandler}></SubmitButton>
                    </footer>
                </div>
            }
        </div >
    )
}