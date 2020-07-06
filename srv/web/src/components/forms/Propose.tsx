import React, { useState, useEffect } from "react"
import { fakeAddress, getPublicKey } from "../../util"
import { RadioButton } from "./RadioButton"
import { Label } from "./Label"
import { Input } from "./Input"
import { SubmitButton } from "./SubmitButton"
import ACCS, { ACCSConfig } from "../../accs/accs"
export const Propose = () => {
    enum Currency {
        BTC,
        BTS,
    }

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


    const rateUnit = (): string[] => {
        switch (fields.currencyToGive) {
            case Currency.BTC:
                return ["BTC", "BTS"]

            case Currency.BTS:
                return ["BTS", "BTC"]
        }
    }

    const [fields, setFields] = useState({
        networkToTrade: Network.MAINNET,
        currencyToGive: Currency.BTC,
        amountToSend: 0,
        rate: 0,
        amountYouReceive: 0,
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


    // calculate received fudns
    useEffect(() => {
        if (fields.amountYouReceive !== fields.amountToSend * fields.rate) {
            setFields({
                ...fields,
                amountYouReceive: fields.amountToSend * fields.rate
            })
        }
    }, [fields])

    //validation
    useEffect(() => {
        const isValid = fields.amountToSend > 0 &&
            fields.rate > 0 &&
            fields.bitcoinPrivateKey !== "" &&
            fields.bitcoinPublicKey !== "" &&
            fields.bitsharesPrivateKey !== "" &&
            fields.bitsharesAccountName !== "" &&
            fields.timelockDuration > 0 &&
            fields.orderDuration > 0 &&
            fields.amountYouReceive > 0

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

        //const accs = new ACCS(fields.networkToTrade)


    }

    return (

        <div className="container flex flex-col px-4 mx-auto mt-12 space-y-20 md:px-0">
            <section>
                <Label label="On what network do you want to trade"></Label>
                <div className="flex flex-col justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <RadioButton
                        description="You are about to trade on mainnet"
                        name="Mainnet"
                        onClick={() => updateFieldByName("networkToTrade", Network.MAINNET)}
                        selected={fields.networkToTrade === Network.MAINNET}
                    ></RadioButton>
                    <RadioButton
                        description="You are about to trade on testnet"
                        name="Testnet"
                        onClick={() => updateFieldByName("networkToTrade", Network.TESTNET)}
                        selected={fields.networkToTrade === Network.TESTNET}
                    ></RadioButton>
                </div>
            </section>

            <section>
                <Label label="What do you want to trade"></Label>
                <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <RadioButton
                        description="You are giving Bitcoin away"
                        name="Bitcoin"
                        onClick={() => updateFieldByName("currencyToGive", Currency.BTC)}
                        selected={fields.currencyToGive === Currency.BTC}
                        tag="BTC"
                    ></RadioButton>
                    <RadioButton
                        description="You are giving Bitshares away"
                        name="Bitshares"
                        onClick={() => updateFieldByName("currencyToGive", Currency.BTS)}
                        selected={fields.currencyToGive === Currency.BTS}
                        tag="BTS"
                    ></RadioButton>
                </div>
            </section>

            <section className="items-center justify-between md:space-x-4 md:flex">

                <div className="flex-grow">
                    <Label label="Amount to send"></Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-600">{rateUnit()[0]}</span>
                        <Input
                            min={0}
                            name="amountToSend"
                            onChange={updateField}
                            placeholder="0.00000000"
                            step={0.00000001}
                            type="number"
                            value={fields.amountToSend}
                        ></Input>
                    </div>
                </div>
                <div className="flex-grow">
                    <Label label="Rate"></Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center mr-6 text-xs text-gray-600">
                            <span>{rateUnit()[1]}</span>
                            <span className="border-t border-gray-500">{rateUnit()[0]}</span>
                        </div>
                        <Input
                            min={0}
                            name="rate"
                            onChange={updateField}
                            placeholder="0.0000"
                            step={0.00000001}
                            type="number"
                            value={fields.rate}
                        ></Input>
                    </div>
                </div>
                <div className="flex-grow">
                    <Label label="excluding fees you will receive"></Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-600">
                            {rateUnit()[1]}           </span>
                        <span className="block w-full py-3 font-mono text-center text-gray-700 border border-gray-200 rounded focus:border-teal-500">{fields.amountYouReceive}</span>
                    </div>
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
                            placeholder=""
                            type="text"
                            value={fields.bitsharesPrivateKey}
                        ></Input>
                    </div>
                </div>
                <p className="px-4 mx-auto mt-2 text-sm text-center text-gray-500">
                    Your public Bitcoin key and Bitshares account name can be calculated from your private key.
                    Your private keys will never leave your browser, it is only used to sign your transactions. <a href="/" className="relative text-xs text-blue-500">Read more in our docs.</a>
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
            <div className="flex flex-col items-center mt-24 sm:flex-row md:flex-col sm:space-x-4 md:space-x-0">

                <section className="">
                    <Label label="Choose your timelock"></Label>
                    <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                        <RadioButton
                            description="You pay the highest fees to increase the chance for your transaction to be picked up by the miners."
                            hint="6 blocks"
                            name={Timelock[Timelock.SHORT]}
                            onClick={() => updateFieldByName("timelockDuration", Timelock.SHORT)}
                            selected={fields.timelockDuration === Timelock.SHORT}
                        ></RadioButton>
                        <RadioButton
                            description="You pay a moderate amount of fees so miners will probably confirm your transaction soon."
                            hint="13 blocks"
                            name={Timelock[Timelock.MEDIUM]}
                            onClick={() => updateFieldByName("timelockDuration", Timelock.MEDIUM)}
                            selected={fields.timelockDuration === Timelock.MEDIUM}
                        ></RadioButton>
                        <RadioButton
                            description="You pay the lowest fees but might have to wait a few more blocks for your transaction to be confirmed."
                            hint="20 blocks"
                            name={Timelock[Timelock.LONG]}
                            onClick={() => updateFieldByName("timelockDuration", Timelock.LONG)}
                            selected={fields.timelockDuration === Timelock.LONG}
                        ></RadioButton>
                    </div>
                </section>

                <section className="md:mt-12">
                    <Label label="Choose your priority"></Label>
                    <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
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
            <footer className="pt-12 mt-8 text-center border-t border-gray-300 f">
                <p className={`-mt-4 pb-4 text-red-500 text-sm ${showError ? "" : "hidden"}`}>Please fill in all fields</p>
                <SubmitButton color={isValid ? "teal" : "gray"} label="Submit" onClick={submitHandler}></SubmitButton>


            </footer>
        </div >
    )
}