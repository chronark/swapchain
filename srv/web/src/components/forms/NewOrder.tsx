import React, { useState, useEffect } from "react"
import { fakeAddress } from "../../util"
import { CryptoChoice } from "./CryptoChoice"
import { PriorityChoice } from "./PriorityChoice"
import { Label } from "./Label"
import { Input } from "./Input"
import { SubmitButton } from "./SubmitButton"
export const NewOrder = () => {
    enum Currency {
        BTC,
        BTS,
    }

    enum Priority {
        HIGH,
        MEDIUM,
        LOW,
    }

    const rateUnit = (): string[] => {
        switch (fields.currencyToGive) {
            case Currency.BTC:
                return ["BTS", "BTC"]

            case Currency.BTS:
                return ["BTC", "BTS"]
        }
    }

    const [fields, setFields] = useState({
        currencyToGive: Currency.BTC,
        amountToSend: 0,
        rate: 0,
        amountYouReceive: 0,
        bitcoinPublicAddress: "",
        bitsharesAccountName: "",
        timelockDuration: 6,
        orderDuration: 7,
        priority: Priority.HIGH,
    })
    const [isValid, setValid] = useState(false)
    const [showError, setShowError] = useState(false)


    // calculate received fudns
    useEffect(() => {
        setFields({
            ...fields,
            amountYouReceive: fields.amountToSend * fields.rate
        })
    }, [fields.amountToSend, fields.rate])

    //validation
    useEffect(() => {
        const isValid = fields.amountToSend > 0 &&
            fields.rate > 0 &&
            fields.bitcoinPublicAddress !== "" &&
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
        console.log(fields)
    }

    return (
        <div className="container mx-auto">
            <section className="mt-8">
                <Label label="What do you want to trade"></Label>
                <div className="flex items-center -mx-3">

                    <button className="flex-grow px-3 focus:outline-none" onClick={() => updateFieldByName("currencyToGive", Currency.BTC)}>
                        <CryptoChoice label="BTC" name="Bitcoin" selected={fields.currencyToGive === Currency.BTC}></CryptoChoice>
                    </button>
                    <button className="flex-grow px-3 focus:outline-none" onClick={() => updateFieldByName("currencyToGive", Currency.BTS)}>
                        <CryptoChoice label="BTS" name="Bitshares" selected={fields.currencyToGive === Currency.BTS}></CryptoChoice>
                    </button>
                </div>
            </section>

            <section className="items-center justify-between mt-12 -mx-3 md:flex">

                <div className="flex-grow p-2">
                    <Label label="Amount to send"></Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-600">
                            {rateUnit()[0]}           </span>
                        <Input name="amountToSend" value={fields.amountToSend} onChange={updateField} type="number" placeholder="0.00000"></Input>
                    </div>
                </div>
                <div className="flex-grow p-2">
                    <Label label="Rate"></Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center mr-6 text-xs text-gray-600">
                            <span>{rateUnit()[1]}</span>
                            <span className="border-t border-gray-500">{rateUnit()[0]}</span>
                        </div>
                        <Input name="rate" value={fields.rate} onChange={updateField} type="number" placeholder="0.00000"></Input>
                    </div> </div>
                <div className="flex-grow p-2">
                    <Label label="excluding fees you will receive"></Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-600">
                            {rateUnit()[1]}           </span>
                        <span className="block w-full py-3 text-center text-gray-700 rounded">{fields.amountYouReceive}</span>
                    </div>
                </div>
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

            <section className="mt-24 -mx-3 md:flex">

                <div className="px-3 md:w-1/2">
                    <Label label="Timelock duration (1 block is roughly 10 minutes)"></Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-600">
                            Blocks          </span>
                        <Input name="timelockDuration" value={fields.timelockDuration} onChange={updateField} type="number" placeholder="6"></Input>
                    </div>
                </div>
                <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                    <Label label="Order duration"></Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-600">
                            Days</span>
                        <Input name="orderDuration" value={fields.orderDuration} onChange={updateField} type="number" placeholder="how long your order will stay active"></Input>
                    </div>
                </div>
            </section>
            <section className="mt-12">
                <Label label="Choose your priority"></Label>
                <div className="flex items-center -mx-3">
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => updateFieldByName("priority", Priority.HIGH)}>
                        <PriorityChoice label={Priority[Priority.HIGH]} description="You pay the highest fees to increase the chance for your transaction to be picked up by the miners." selected={fields.priority === Priority.HIGH}></PriorityChoice>
                    </button>
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => updateFieldByName("fields.", Priority.MEDIUM)}>
                        <PriorityChoice label={Priority[Priority.MEDIUM]} description="You pay a moderate amount of fees so miners will probably confirm your transaction soon." selected={fields.priority === Priority.MEDIUM}></PriorityChoice>
                    </button>
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => updateFieldByName("priority", Priority.LOW)}>
                        <PriorityChoice label={Priority[Priority.LOW]} description="You pay the lowest fees but might have to wait a few more blocks for your transaction to be confirmed." selected={fields.priority === Priority.LOW}></PriorityChoice>
                    </button>
                </div>
            </section>

            <footer className="pt-12 mt-8 text-center border-t border-gray-300 f">
                <p className={`-mt-4 pb-4 text-red-500 text-sm ${showError ? "" : "hidden"}`}>Please fill in all fields</p>
                <SubmitButton color={isValid ? "teal" : "gray"} label="Submit" onClick={submitHandler}></SubmitButton>


            </footer>
        </div>
    )
}