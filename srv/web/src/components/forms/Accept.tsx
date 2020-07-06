import React, { useState, useEffect } from "react"
import { fakeAddress } from "../../util"
import { Label } from "./Label"
import { Input } from "./Input"
import { SubmitButton } from "./SubmitButton"
import { Form } from "./Form"
import { ReactComponent as Exclamation } from "../../icons/exclamation.svg"

import {RadioButton} from "./RadioButton"
export const Accept = () => {
    enum Network {
        MAINNET = "mainnet",
        TESTNET = "testnet",
    }


    enum Timelock {
        LONG,
        MEDIUM,
        SHORT,
    }

    enum Priority {
        HIGH,
        MEDIUM,
        LOW,
    }


    const [fields, setFields] = useState({
        networkToTrade: Network.MAINNET,
        hash: "",
        bitcoinPrivateKey: "",
        bitcoinPublicKey: "",
        bitsharesPrivateKey: "",
        bitsharesAccountName: "",
        counterpartyBitcoinPublicKey: "",
        counterpartyBitsharesAccountName: "",
        timelockDuration: Timelock.SHORT,
        orderDuration: 7,
        priority: Priority.HIGH,
    })
    const [isValid, setValid] = useState(false)
    const [showError, setShowError] = useState(false)


    //validation
    useEffect(() => {
        const isValid = fields.bitcoinPrivateKey !== "" &&
            fields.bitsharesPrivateKey !== "" &&
            fields.counterpartyBitcoinPublicKey !== "" &&
            fields.counterpartyBitsharesAccountName !== "" &&
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
        console.log(fields)
    }
    return (
        <Form
            main={
                <div className="flex flex-col justify-center w-full p-8">
                    <h2 className="text-3xl font-bold leading-tight text-gray-800">Accept an Atomic Cross Chain Swap</h2>
                    <div className="flex flex-col mt-12 space-y-10">
                    <section>
                            <Label label="On what network do you want to trade"></Label>
                            <div className="flex flex-col justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                                <RadioButton
                                    description="You are sending real money!"
                                    name="Mainnet"
                                    tag={<Exclamation className={`h-8 text-red-600 ${fields.networkToTrade === Network.MAINNET ? "" : "hidden"}`}></Exclamation>}
                                    onClick={() => updateFieldByName("networkToTrade", Network.MAINNET)}
                                    selected={fields.networkToTrade === Network.MAINNET}
                                ></RadioButton>
                                <RadioButton
                                    description="Send test currencies on the testnet"
                                    name="Testnet"
                                    onClick={() => updateFieldByName("networkToTrade", Network.TESTNET)}
                                    selected={fields.networkToTrade === Network.TESTNET}
                                ></RadioButton>
                            </div>
                        </section>
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
                                        placeholder="amos"
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
                                        name="counterpartyBitsharesAccountName"
                                        onChange={updateField}
                                        placeholder=""
                                        type="text"
                                        value={fields.counterpartyBitsharesAccountName}
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
                        <section>
                            <h2 className="text-xl font-bold leading-tight text-gray-800">HTLC settings</h2>
                            <div className="mt-4">
                                <Label label="Choose your timelock"></Label>
                                <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                                    <RadioButton
                                        description="Around 1 hour. This is the shortest duration possible while making sure the transactions are confirmed in time."
                                        hint="6 blocks"
                                        name={Timelock[Timelock.SHORT]}
                                        onClick={() => updateFieldByName("timelockDuration", Timelock.SHORT)}
                                        selected={fields.timelockDuration === Timelock.SHORT}
                                    ></RadioButton>
                                    <RadioButton
                                        description="Around 2 hours. Offers more time for the counterparty to come online."
                                        hint="13 blocks"
                                        name={Timelock[Timelock.MEDIUM]}
                                        onClick={() => updateFieldByName("timelockDuration", Timelock.MEDIUM)}
                                        selected={fields.timelockDuration === Timelock.MEDIUM}
                                    ></RadioButton>
                                    <RadioButton
                                        description="Around 3 hours. Gives your counterparty even more time."
                                        hint="20 blocks"
                                        name={Timelock[Timelock.LONG]}
                                        onClick={() => updateFieldByName("timelockDuration", Timelock.LONG)}
                                        selected={fields.timelockDuration === Timelock.LONG}
                                    ></RadioButton>
                                </div>
                                <p className="px-4 mx-auto mt-2 text-sm text-center text-gray-500">
                                    By design one block should equal 10 minutes. However it can differ quite a lot in reality. Please make sure you enter the same value as your trading partner.
                                    </p>
                            </div>
                        </section>

                        <section>
                            <Label label="Choose your priority"></Label>
                            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                                <RadioButton
                                    description="You pay the highest fees to increase the chance for your transaction to be picked up by the miners."
                                    name={Priority[Priority.HIGH]}
                                    onClick={() => updateFieldByName("priority", Priority.HIGH)}
                                    selected={fields.priority === Priority.HIGH}
                                ></RadioButton>
                                <RadioButton
                                    description="You pay a moderate amount of fees so miners will probably confirm your transaction soon."
                                    name={Priority[Priority.MEDIUM]}
                                    onClick={() => updateFieldByName("priority", Priority.MEDIUM)}
                                    selected={fields.priority === Priority.MEDIUM}
                                ></RadioButton>
                                <RadioButton
                                    description="You pay the lowest fees but might have to wait a few more blocks for your transaction to be confirmed."
                                    name={Priority[Priority.LOW]}
                                    onClick={() => updateFieldByName("priority", Priority.LOW)}
                                    selected={fields.priority === Priority.LOW}
                                ></RadioButton>
                            </div>
                        </section>
                    </div>
                </div>
            }
            footer={
                <div>
                    <p className={`-mt-4 pb-4 text-red-500 text-sm ${showError ? "" : "hidden"}`}>Please fill in all fields</p>
                    <SubmitButton borderColor={isValid ? "teal" : "gray"} label="Submit" onClick={submitHandler}></SubmitButton>
                </div>
            }></Form>
    )
}