import React, { useState } from "react"
import { fakeAddress } from "../../util"
import { CryptoChoice } from "./CryptoChoice"
import { PriorityChoice } from "./PriorityChoice"
import { Label } from "./Label"
import { Input } from "./Input"
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
        switch (CurrencyToGive) {
            case Currency.BTC:
                return ["BTS", "BTC"]

            case Currency.BTS:
                return ["BTC", "BTS"]
        }
    }

    const [CurrencyToGive, setCurrencyToGive] = useState(Currency.BTC)
    const [priority, setPriority] = useState(Priority.HIGH)


    return (
        <div className="container mx-auto">
            <header className="-mt-6">
                <h1 className="text-2xl font-medium leading-4 text-gray-500">Create a new order</h1>
            </header>
            <section className="mt-8">
                <Label label="What do you want to trade"></Label>
                <div className="flex items-center -mx-3">

                    <button className="flex-grow px-3 focus:outline-none" onClick={() => setCurrencyToGive(Currency.BTC)}>
                        <CryptoChoice label="BTC" name="Bitcoin" selected={CurrencyToGive === Currency.BTC}></CryptoChoice>
                    </button>
                    <button className="flex-grow px-3 focus:outline-none" onClick={() => setCurrencyToGive(Currency.BTS)}>
                        <CryptoChoice label="BTS" name="Bitshares" selected={CurrencyToGive === Currency.BTS}></CryptoChoice>
                    </button>
                </div>
            </section>

            <section className="items-center justify-between mt-12 -mx-3 md:flex">

                <div className="flex-grow p-2">
                    <Label label="Amount to send"></Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-700">
                            {rateUnit()[0]}           </span>
                        <Input type="number" placeholder="0.00000"></Input>
                    </div>
                </div>
                <div className="flex-grow p-2">
                    <Label label="Rate"></Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center mr-6 text-xs text-gray-700">
                            <span>{rateUnit()[1]}</span>
                            <span className="border-t border-gray-500">{rateUnit()[0]}</span>
                        </div>
                        <Input type="number" placeholder="0.00000"></Input>
                    </div> </div>
                <div className="flex-grow p-2">
                    <Label label="excluding fees you will receive"></Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-700">
                            {rateUnit()[1]}           </span>
                        <span className="block w-full py-3 text-center text-gray-700 rounded">1</span>
                    </div>
                </div>
            </section>

            <section className="mt-12 -mx-3 md:flex">

                <div className="px-3 md:w-1/2">
                    <Label label="Bitcoin public address"></Label>
                    <Input type="text" placeholder={fakeAddress(30)}></Input>
                </div>
                <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                    <Label label="Bitshares account name"></Label>
                    <Input type="text" placeholder="amos"></Input>
                </div>
            </section>

            <section className="mt-24 -mx-3 md:flex">

                <div className="px-3 md:w-1/2">
                    <Label label="Timelock duration (1 block is roughly 10 minutes)"></Label>
                    <Input type="text" placeholder="Number of blocks"></Input>
                </div>
                <div className="px-3 mt-4 md:w-1/2 md:mt-0">
                    <Label label="Order duration"></Label>
                    <Input type="text" placeholder="how long your order will stay active"></Input>
                </div>
            </section>
            <section className="mt-12">
                <Label label="Choose your priority"></Label>
                <div className="flex items-center -mx-3">
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => setPriority(Priority.HIGH)}>
                        <PriorityChoice label={Priority[Priority.HIGH]} description="You pay the highest fees to increase the chance for your transaction to be picked up by the miners." selected={priority === Priority.HIGH}></PriorityChoice>
                    </button>
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => setPriority(Priority.MEDIUM)}>
                        <PriorityChoice label={Priority[Priority.MEDIUM]} description="You pay a moderate amount of fees so miners will probably confirm your transaction soon." selected={priority === Priority.MEDIUM}></PriorityChoice>
                    </button>
                    <button className="w-1/3 px-3 focus:outline-none" onClick={() => setPriority(Priority.LOW)}>
                        <PriorityChoice label={Priority[Priority.LOW]} description="You pay the lowest fees but might have to wait a few more blocks for your transaction to be confirmed." selected={priority === Priority.LOW}></PriorityChoice>
                    </button>
                </div>
            </section>

            <footer className="flex items-center justify-around pt-12 mt-8 text-center border-t border-gray-300">
                <button className="inline-flex px-8 py-3 font-semibold text-gray-900 uppercase transition duration-200 ease-in-out bg-teal-100 border border-b-4 border-teal-400 rounded-sm hover:bg-white">
                    Submit
                            </button>


            </footer>
        </div>
    )
}