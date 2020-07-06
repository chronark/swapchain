import React, { useState, useEffect } from "react"
import { fakeAddress, getPublicKey } from "../../util"
import { RadioButton } from "./RadioButton"
import { Label } from "./Label"
import { Input } from "./Input"
import { SubmitButton } from "./SubmitButton"
import ACCS, { ACCSConfig } from "../../accs/accs"
export const NewOrder = () => {
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

        <div className="container mx-auto">
            <section className="mt-8">
                <Label label="On what network do you want to trade"></Label>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 justify-center">

                    <button className="flex-grow focus:outline-none" onClick={() => updateFieldByName("networkToTrade", Network.MAINNET)}>
                        <RadioButton description="You are about to trade on mainnet" name="Mainnet" selected={fields.networkToTrade === Network.MAINNET}></RadioButton>
                    </button>
                    <button className="flex-grow focus:outline-none" onClick={() => updateFieldByName("networkToTrade", Network.TESTNET)}>
                        <RadioButton description="You are about to trade on testnet" name="Testnet" selected={fields.networkToTrade === Network.TESTNET}></RadioButton>
                    </button>

                </div>
            </section>
        
            <section className="mt-12">
                <Label label="What do you want to trade"></Label>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 justify-center">
                    <button className="flex-grow focus:outline-none" onClick={() => updateFieldByName("currencyToGive", Currency.BTC)}>
                        <RadioButton description="You are giving Bitcoin away" tag="BTC" name="Bitcoin" selected={fields.currencyToGive === Currency.BTC}></RadioButton>
                    </button>
                    <button className="flex-grow focus:outline-none" onClick={() => updateFieldByName("currencyToGive", Currency.BTS)}>
                        <RadioButton description="You are giving Bitshares away" tag="BTS" name="Bitshares" selected={fields.currencyToGive === Currency.BTS}></RadioButton>
                    </button>
                </div>
            </section>

            <section className="items-center justify-between mt-12 md:space-x-4 md:flex">

                <div className="flex-grow">
                    <Label label="Amount to send"></Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-600">{rateUnit()[0]}</span>
                        <Input min={0} step={0.00000001 } name="amountToSend" value={fields.amountToSend} onChange={updateField} type="number" placeholder="0.00000000"></Input>
                    </div>
                </div>
                <div className="flex-grow">
                    <Label label="Rate"></Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center mr-6 text-xs text-gray-600">
                            <span>{rateUnit()[1]}</span>
                            <span className="border-t border-gray-500">{rateUnit()[0]}</span>
                        </div>
                        <Input min={0} step={0.00000001 }name="rate" value={fields.rate} onChange={updateField} type="number" placeholder="0.0000"></Input>
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

            <h2 className="mt-12 text-2xl font-bold leading-tight text-gray-900">Your Data</h2>

            <section className="mt-8 -mx-3 md:flex">
                <div className="px-3 md:w-1/2">
                    <Label label="Bitcoin private key"></Label>
                    <Input name="bitcoinPrivateKey" value={fields.bitcoinPrivateKey} onChange={updateField} type="text" placeholder={fakeAddress(30)}></Input>
                </div>
                <div className="px-3 md:w-1/2"> 
                    <Label label="Bitcoin public key"></Label>
                    <span className={`block w-full py-3 font-mono  text-center ${fields.bitcoinPrivateKey ? "text-gray-700" : "text-gray-500"} border border-gray-200 rounded focus:border-teal-500`}>{fields.bitcoinPrivateKey ? getPublicKey(fields.bitcoinPrivateKey) : "No private key given"}</span>
                </div>
            </section>

            <section className="mt-8 -mx-3">
                <div className="md:flex">
                    <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                        <Label label="Bitshares private key"></Label>
                        <Input name="bitsharesAccountName" value={fields.bitsharesAccountName} onChange={updateField} type="text" placeholder={fakeAddress(30)}></Input>
                    </div>
                    <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                        <Label label="Bitshares account name"></Label>
                        <Input name="bitsharesPrivateKey" value={fields.bitsharesPrivateKey} onChange={updateField} type="text" placeholder=""></Input>
                    </div>
                </div>
                <p className="mt-4 text-sm text-center text-gray-500">
                    Your private keys will never leave your browser, they are only used to sign your transactions. For privacy reasons we strongly recommend not to reuse key pairs. <a href="/" className="relative text-xs text-blue-500">Read more in our docs.</a>
                </p>

            </section>

            <h2 className="mt-12 text-2xl font-bold leading-tight text-gray-900">Counterparty Data</h2>

            <section className="mt-8 -mx-3 md:flex">
                <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                    <Label label="Bitcoin public key"></Label>
                    <Input name="counterpartyBitcoinPublicKey" value={fields.counterpartyBitcoinPublicKey} onChange={updateField} type="text" placeholder={fakeAddress(30)}></Input>
                </div>
                <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                    <Label label="Bitshares account name"></Label>
                    <Input name="counterpartyBitsharesAccountName" value={fields.counterpartyBitsharesAccountName} onChange={updateField} type="text" placeholder=""></Input>
                </div>

            </section>

            <section className="mt-24">
                <Label label="Choose your timelock"></Label>
                <div className="flex items-center -mx-3">
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => updateFieldByName("timelockDuration", Timelock.SHORT)}>
                        <RadioButton name={Timelock[Timelock.SHORT]} description="You pay the highest fees to increase the chance for your transaction to be picked up by the miners." selected={fields.timelockDuration === Timelock.SHORT}></RadioButton>
                    </button>
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => updateFieldByName("timelockDuration", Timelock.MEDIUM)}>
                        <RadioButton name={Timelock[Timelock.MEDIUM]} description="You pay a moderate amount of fees so miners will probably confirm your transaction soon." hint="13 blocks    " selected={fields.timelockDuration === Timelock.MEDIUM}></RadioButton>
                    </button>
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => updateFieldByName("timelockDuration", Timelock.LONG)}>
                        <RadioButton name={Timelock[Timelock.LONG]} description="You pay the lowest fees but might have to wait a few more blocks for your transaction to be confirmed." selected={fields.timelockDuration === Timelock.LONG}></RadioButton>
                    </button>
                </div>
            </section>

            <section className="mt-12">
                <Label label="Choose your priority"></Label>
                <div className="flex items-center -mx-3">
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => updateFieldByName("priority", Priority.HIGH)}>
                        <RadioButton name={Priority[Priority.HIGH]} description="You pay the highest fees to increase the chance for your transaction to be picked up by the miners." selected={fields.priority === Priority.HIGH}></RadioButton>
                    </button>
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => updateFieldByName("priority", Priority.MEDIUM)}>
                        <RadioButton name={Priority[Priority.MEDIUM]} description="You pay a moderate amount of fees so miners will probably confirm your transaction soon." selected={fields.priority === Priority.MEDIUM}></RadioButton>
                    </button>
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => updateFieldByName("priority", Priority.LOW)}>
                        <RadioButton name={Priority[Priority.LOW]} description="You pay the lowest fees but might have to wait a few more blocks for your transaction to be confirmed." selected={fields.priority === Priority.LOW}></RadioButton>
                    </button>
                </div>
            </section>

            <footer className="pt-12 mt-8 text-center border-t border-gray-300 f">
                <p className={`-mt-4 pb-4 text-red-500 text-sm ${showError ? "" : "hidden"}`}>Please fill in all fields</p>
                <SubmitButton color={isValid ? "teal" : "gray"} label="Submit" onClick={submitHandler}></SubmitButton>


            </footer>
        </div >
    )
}