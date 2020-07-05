import React, { useState, useEffect } from "react"
import { fakeAddress } from "../../util"
import { Label } from "./Label"
import { Input } from "./Input"
import { SubmitButton } from "./SubmitButton"
import ACCS, { ACCSConfig } from "../../accs/accs"
import { ECPair } from "bitcoinjs-lib"
import { getSecret } from "../../pkg/secret/secret"

export const TakerAccept = () => {
    const [fields, setFields] = useState({
        bitcoinPrivateKey: "",
        bitsharesPrivateKey: "",
        bitcoinPublicAddress: "", 
        bitsharesAccountName: "",
        hash: getSecret(),
        amount: "",
        timelockDuration: 6, 
    })

    const [isValid, setValid] = useState(false)
    const [showError, setShowError] = useState(false)


    //validation
    useEffect(() => {
        const isValid = fields.bitcoinPrivateKey !== "" &&
            fields.bitsharesPrivateKey !== "" &&
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

        const accs = new ACCS(fields.bitcoinPrivateKey)
        const config = {} as ACCSConfig
        //config.txType = fields. -  does this even belong to the ProposerAccept? 
        config.privateKeyBTS = fields.bitsharesPrivateKey
        //config.keyPairCompressedBTC = fields.bitcoinPublicAddress
        config.accountBTS = fields.bitsharesAccountName
        config.amount = fields.amount // still put amout field in UI 
        config.timelockBTC = fields.timelockDuration
        config.secret= fields.hash // we dont have to generate a secret hash again - but secret does not accept a string, only getSecret()
        console.log(fields)
    }
    return (
        <form className="container mx-auto">
            <section className="mt-12 ">
                <div className="-mx-3 md:flex">
                    <div className="px-3 md:w-1/2">
                        <Label label="Bitcoin private key"></Label>
                        <Input name="bitcoinPrivateKey" value={fields.bitcoinPrivateKey} onChange={updateField} type="text" placeholder={fakeAddress(15)}></Input>
                    </div>
                    <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                        <Label label="Bitshares private key"></Label>
                        <Input name="bitsharesPrivateKey" value={fields.bitsharesPrivateKey} onChange={updateField} type="text" placeholder={fakeAddress(15)}></Input>
                    </div>
                </div>
                <p className="mt-2 text-sm text-center text-gray-500 ">
                    Your private keys will never leave your browser, it is only used to sign your transactions. <a href="/" className="relative text-xs text-blue-500">Read more in our docs.</a>
                </p>
            </section>

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
            
            <section className="mt-12">

                <div className="block">
                    <Label label="Hash from Counterparty"></Label>
                    <Input name="hash" value={fields.hash} onChange={updateField} type="text" placeholder="Please enter the hash you received from your trading partner"></Input>
                </div>

            </section>

            <section className="mt-12">          
                <div className="md:w-1/2">
                        <Label label="Timelock duration (1 block is roughly 10 minutes)"></Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-600">
                                Blocks          </span>
                            <Input name="timelockDuration" value={fields.timelockDuration} onChange={updateField} type="number" placeholder="6"></Input>
                        </div>
                        <p className="mt-2 text-sm text-center text-gray-500 ">
                        As a taker always make sure to set a timelock shorter than the proposer.</p>
                    </div>
                </section>




            <footer className="pt-12 mt-8 text-center border-t border-gray-300 f">
                <p className={`-mt-4 pb-4 text-red-500 text-sm ${showError ? "" : "hidden"}`}>Please fill in all fields</p>
                <SubmitButton color={isValid ? "teal" : "gray"} label="Submit" onClick={submitHandler}></SubmitButton>


            </footer>
        </form>
    )
}