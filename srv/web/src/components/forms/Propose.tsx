import React, { useState, useEffect } from "react"
import { fakeKey } from "../../util"
import { RadioButton } from "./RadioButton"
import { Label } from "./Label"
import { Input } from "./Input"
import { SubmitButton } from "./SubmitButton"
import { ReactComponent as Exclamation } from "../../icons/exclamation.svg"
import { Form } from "./Form"
import { Spinner } from "../Spinner"
import { State, Currency, Network, Timelock, Priority } from "./enums"

export const Propose = () => {
    // Application stae for handling the flow
    const [state, setState] = useState(State.IDLE)
    const [isValid, setValid] = useState(false)

    // Used to display helpful error messages to the user
    const [errorMessage, setErrorMessage] = useState("")

    // Collects the user input in one place
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

    /**
     * Get the unit of the rate multiplier.
     * @returns Either BTC/BTS or BTS/BTC
     */
    const rateUnit = (): string[] => {
        switch (fields.currencyToGive) {
            case Currency.BTC:
                return ["BTC", "BTS"]
            case Currency.BTS:
                return ["BTS", "BTC"]
        }
    }

    //calculate received funds
    useEffect(() => {
        if (fields.amountYouReceive !== fields.amountToSend * fields.rate) {
            setFields({
                ...fields,
                amountYouReceive: fields.amountToSend * fields.rate
            })
        }
    }, [fields])

    /**
    * Validate all fields.
    * @returns The respective error messsage or empty string if valid.
    */
    const validate = (): string => {
        if (fields.amountToSend <= 0) {
            return "Amount to send is empty"
        }
        if (fields.rate <= 0) {
            return "Rate is empty"
        }
        if (fields.amountYouReceive <= 0) {
            return "Amount you receive is not valid"
        }
        if (fields.bitcoinPrivateKey.length === 32) {
            return "Bitcoin private key is not 32 characters long"
        }
        if (fields.bitsharesPrivateKey === "") {
            return "Bitshares private key is empty"
        }
        if (fields.counterpartyBitcoinPublicKey === "") {
            return "Counterparty bitcoin public key is empty"
        }
        if (fields.counterpartyBitsharesAccountName === "") {
            return "Counterparty bitshares account name is empty"
        }
        return ""
    }

    // Go back to idle when the user fixes their input errors.
    // Does nothing if the accs is already running
    useEffect(() => {
        // Failure state is final
        if (state !== State.FAILURE) {
            if (state !== State.RUNNING && isValid) {
                setErrorMessage("")
                setState(State.IDLE)
            }
        }
    }, [fields, state, isValid])


    /**
     * Update the field state from a FormEvent
     * @param e - HTMLInput FormEvent.
     */
    const updateField = (e: React.FormEvent<HTMLInputElement>) => {
        setFields({
            ...fields,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }
    /**
     * Update the field state manually via onClick for example.
     * @param key - The key in the field state.
     * @param value - New value to be stored.
     */
    const updateFieldByKey = (key: string, value: number | string) => {
        setFields({
            ...fields,
            [key]: value
        })
    }

    /**
     * This hook handles the SubmitButton.
     * When a user thinks he is done filling out the form it is validated first and feedback is given to the user.
     */
    const submitHandler = () => {
        const errorMessage = validate()
        setValid(errorMessage === "")
        
        // Checking "manually" because the state is updated asynchronously
        if (errorMessage !== "") {
            setErrorMessage(errorMessage)
            setState(State.INVALID_INPUT)
            return
        }


        setState(State.RUNNING)

        // TODO: Replace with accs
        setTimeout(() => {
            if (Math.random() > 0.5) {
                setState(State.SUCCESS)
            } else {
                setState(State.ERROR)
                setErrorMessage("Nico didn't do his job, should we fire him?")
            }
        }, 5000)
    }

    return (
        <Form
            main={
                <div className="flex flex-col justify-center w-full p-8">
                    <h2 className="text-3xl font-bold leading-tight text-gray-800 ">Propose a new Atomic Cross Chain Swap</h2>
                    <div className="flex flex-col mt-12 space-y-10">
                        <section>
                            <Label label="On what network do you want to trade"></Label>
                            <div className="flex flex-col justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                                <RadioButton
                                    description="You are sending real money!"
                                    name="Mainnet"
                                    tag={<Exclamation className={`h-8 text-red-600 ${fields.networkToTrade === Network.MAINNET ? "" : "hidden"}`}></Exclamation>}
                                    onClick={() => updateFieldByKey("networkToTrade", Network.MAINNET)}
                                    selected={fields.networkToTrade === Network.MAINNET}
                                ></RadioButton>
                                <RadioButton
                                    description="Send test currencies on the testnet"
                                    name="Testnet"
                                    onClick={() => updateFieldByKey("networkToTrade", Network.TESTNET)}
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
                                    onClick={() => updateFieldByKey("currencyToGive", Currency.BTC)}
                                    selected={fields.currencyToGive === Currency.BTC}
                                    tag="BTC"
                                ></RadioButton>
                                <RadioButton
                                    description="You are giving Bitshares away"
                                    name="Bitshares"
                                    onClick={() => updateFieldByKey("currencyToGive", Currency.BTS)}
                                    selected={fields.currencyToGive === Currency.BTS}
                                    tag="BTS"
                                ></RadioButton>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold leading-tight text-gray-800">Amount</h2>
                            <div className="items-center justify-between mt-4 md:space-x-4 md:flex">
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
                                        placeholder={fakeKey(30, fields.networkToTrade)}
                                        type="text"
                                        value={fields.bitcoinPrivateKey}
                                    ></Input>
                                </div>
                                <div className="md:w-1/2">
                                    <Label label="Bitshares private key"></Label>
                                    <Input
                                        name="bitsharesPrivateKey"
                                        onChange={updateField}
                                        placeholder={"5" + fakeKey(30, fields.networkToTrade)}
                                        type="text"
                                        value={fields.bitsharesPrivateKey}
                                    ></Input>
                                </div>
                            </div>
                            <p className="px-4 mx-auto mt-2 text-sm text-center text-gray-500">
                                Your public Bitcoin key and Bitshares account name can be derived from your private key. Your private keys will never leave your browser, they are only used to sign your transactions. <a href="/" className="relative text-xs text-blue-500">Read more in our docs.</a>
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
                                        placeholder={"02" + fakeKey(30, fields.networkToTrade)}
                                        type="text"
                                        value={fields.counterpartyBitcoinPublicKey}
                                    ></Input>
                                </div>
                                <div className="md:w-1/2">
                                    <Label label="Bitshares account name"></Label>
                                    <Input
                                        name="counterpartyBitsharesAccountName"
                                        onChange={updateField}
                                        placeholder="amos"
                                        type="text"
                                        value={fields.counterpartyBitsharesAccountName}
                                    ></Input>
                                </div>
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
                                        onClick={() => updateFieldByKey("timelockDuration", Timelock.SHORT)}
                                        selected={fields.timelockDuration === Timelock.SHORT}
                                    ></RadioButton>
                                    <RadioButton
                                        description="Around 2 hours. Offers more time for the counterparty to come online."
                                        hint="13 blocks"
                                        name={Timelock[Timelock.MEDIUM]}
                                        onClick={() => updateFieldByKey("timelockDuration", Timelock.MEDIUM)}
                                        selected={fields.timelockDuration === Timelock.MEDIUM}
                                    ></RadioButton>
                                    <RadioButton
                                        description="Around 3 hours. Gives your counterparty even more time."
                                        hint="20 blocks"
                                        name={Timelock[Timelock.LONG]}
                                        onClick={() => updateFieldByKey("timelockDuration", Timelock.LONG)}
                                        selected={fields.timelockDuration === Timelock.LONG}
                                    ></RadioButton>
                                </div>
                                <p className="px-4 mx-auto mt-2 text-sm text-center text-gray-500">
                                    By design one block should equal 10 minutes. However it can differ quite a lot in reality. We suggest leaving this at SHORT and scheduling with your counterparty accordingly. Please make sure you tell your trading partner what you chose because these values must match.
                                    </p>
                            </div>
                        </section>

                        <section>
                            <Label label="Choose your priority"></Label>
                            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                                <RadioButton
                                    description="You pay the highest fees to increase the chance for your transaction to be picked up by the miners."
                                    name={Priority[Priority.HIGH]}
                                    onClick={() => updateFieldByKey("priority", Priority.HIGH)}
                                    selected={fields.priority === Priority.HIGH}
                                ></RadioButton>
                                <RadioButton
                                    description="You pay a moderate amount of fees so miners will probably confirm your transaction soon."
                                    name={Priority[Priority.MEDIUM]}
                                    onClick={() => updateFieldByKey("priority", Priority.MEDIUM)}
                                    selected={fields.priority === Priority.MEDIUM}
                                ></RadioButton>
                                <RadioButton
                                    description="You pay the lowest fees but might have to wait a few more blocks for your transaction to be confirmed."
                                    name={Priority[Priority.LOW]}
                                    onClick={() => updateFieldByKey("priority", Priority.LOW)}
                                    selected={fields.priority === Priority.LOW}
                                ></RadioButton>
                            </div>
                        </section>
                    </div>
                </div>
            }
            footer={
                <>
                    {(function () {
                        switch (state) {
                            case State.IDLE:
                                return <SubmitButton borderColor="teal" label="Submit" onClick={submitHandler}></SubmitButton>
                            case State.INVALID_INPUT:
                                return < div className="flex flex-col">
                                    <p className="pb-4 text-red-400 text-bold">{errorMessage}</p>
                                    <SubmitButton borderColor="gray" label="Submit" onClick={submitHandler}></SubmitButton>
                                </div>
                            case State.RUNNING:
                                return <Spinner className="h-20 bg-transparent"></Spinner>
                            case State.SUCCESS:
                                return <span className="p-10 text-teal-400 text-bold">SUCCESS</span>
                            case State.ERROR:
                                return < div className="flex flex-col">
                                    <p className="pb-4 text-red-400 text-bold">{errorMessage}</p>
                                    <SubmitButton borderColor="gray" label="Try again" onClick={submitHandler}></SubmitButton>
                                </div>
                            case State.FAILURE:
                                return <p className="pb-4 text-xl text-red-400 text-bold">{errorMessage}</p>
                                
                        }
                    })()}
                </>
            }
        ></Form >

    )
}