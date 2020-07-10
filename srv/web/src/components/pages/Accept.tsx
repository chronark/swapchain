import React, { useState, useEffect } from "react"
import { fakeKey } from "../../util"
import { Label } from "../forms/Label"
import { Input } from "../forms/Input"
import { SubmitButton } from "../forms/SubmitButton"
import { Form } from "../forms/Form"
import { ReactComponent as Exclamation } from "../../icons/exclamation.svg"
import { Spinner } from "../util/Spinner"
import { RadioButton } from "../forms/RadioButton"
import { State, Network, Priority, Currency } from "../util/enums"
import ACCS from "../../accs/accs"
import { isValidBitcoinPrivateKey, isValidBitsharesPrivateKey, isValidBitcoinPublicKey } from "../../pkg/address/validator"
import { Secret } from "../../pkg/secret/secret"
import {ReactComponent as ShieldSuccess} from "../../icons/shield-check.svg"
import {ReactComponent as ShieldFailure} from "../../icons/shield-exclamation.svg"

export const Accept = () => {
    // Application stae for handling the flow
    const [state, setState] = useState(State.IDLE)
    const [isValid, setValid] = useState(false)

    // Used to display helpful error messages to the user
    const [errorMessage, setErrorMessage] = useState("")

    // Collects the user input in one place
    const [fields, setFields] = useState({
        mode: "accepter",
        networkToTrade: Network.TESTNET,
        currencyToGive: Currency.BTS,
        amountToSend: 0,
        rate: 0,
        amountToReceive: 0,
        bitcoinPrivateKey: "",
        bitsharesPrivateKey: "",
        counterpartyBitcoinPublicKey: "",
        counterpartyBitsharesAccountName: "",
        bitcoinTxID: "",
        priority: Priority.HIGH,
        secret: {} as Secret,
        hash: "",
    })

    //calculate received funds
    useEffect(() => {
        if (fields.amountToReceive !== fields.amountToSend * fields.rate && fields.amountToReceive !== fields.amountToSend / fields.rate) {
            setFields({
                ...fields,
                amountToReceive: (fields.currencyToGive === Currency.BTC) ? fields.amountToSend * fields.rate : fields.amountToSend / fields.rate
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
        if (fields.amountToReceive <= 0) {
            return "Amount you receive is not valid"
        }
        if (!isValidBitcoinPrivateKey(fields.bitcoinPrivateKey, fields.networkToTrade)) {
            return "Bitcoin private key is invalid"
        }
        if (!isValidBitsharesPrivateKey(fields.bitsharesPrivateKey)) {
            return "Bitshares private key is invalid"
        }
        if (!isValidBitcoinPublicKey(fields.counterpartyBitcoinPublicKey)) {
            return "Counterparty bitcoin public key is invalid"
        }
        if (fields.counterpartyBitsharesAccountName === "") {
            return "Counterparty bitshares account name is empty"
        }
        if (fields.currencyToGive === Currency.BTC && fields.bitcoinTxID.length !== 64) {
            return "Bitcoin Transaction ID to spend is invalid"
        }
        if (fields.hash.length !== 64) {
            return "Secret hash is invalid"
        }
        return ""
    }

    // Go back to idle when the user fixes their input errors.
    // Does nothing if the accs is already running
    useEffect(() => {
        if (state === State.ERROR && isValid) {
            setErrorMessage("")
            setState(State.IDLE)
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
            setState(State.ERROR)
            return
        }

        fields.secret = {
            preimage: undefined,
            hash: Buffer.from(fields.hash, "hex")
        }

        setState(State.RUNNING)

        ACCS.run(fields).then(() => {
            setState(State.SUCCESS)
        }).catch((err) => {
            setState(State.FAILURE)
            setErrorMessage(err.toString())
        })
    }


    const formFields = <div>
        <h2 className="text-3xl font-semibold leading-tight text-gray-800 ">Accept an Atomic Cross Chain Swap</h2>
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Amount</h2>
                <div className="items-center justify-between mt-4 md:space-x-4 md:flex">
                    <div className="flex-grow">
                        <Label label="Amount to send"></Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 flex items-center mr-6 text-sm text-gray-600">{fields.currencyToGive}</span>
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
                                <span>BTS</span>
                                <span className="border-t border-gray-500">BTC</span>
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
                                {fields.currencyToGive === Currency.BTC ? Currency.BTS : Currency.BTC}           </span>
                            <span className="block w-full py-3 font-mono text-center text-gray-700 border border-gray-200 rounded focus:border-teal-500">{fields.amountToReceive}</span>
                        </div>
                    </div>
                </div>
            </section>


            <section>
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Your Data</h2>
                <div className="flex flex-col space-y-2">
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
                    <p className="px-4 mx-auto text-sm text-center text-gray-500">
                        Your public Bitcoin key and Bitshares account name can be derived from your private key. Your private keys will never leave your browser, they are only used to sign your transactions. <a href="/" className="relative text-xs text-blue-500">Read more in our docs.</a>
                    </p>
                </div>
                <div className={`mt-2 ${fields.currencyToGive === "BTC" ? "" : "hidden"}`}>
                    <Label label="Bitcoin transaction ID to spend"></Label>
                    <Input
                        name="bitcoinTxID"
                        onChange={updateField}
                        placeholder={fakeKey(30, "testnet")}
                        type="text"
                        value={fields.bitcoinTxID}
                    ></Input>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Counterparty Data</h2>
                <div className="flex flex-col space-y-4">
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
                    <div className="block">
                        <Label label="Secret hash from Counterparty"></Label>
                        <Input name="hash" value={fields.hash} onChange={updateField} type="text" placeholder={fakeKey(30, fields.networkToTrade)}></Input>
                    </div>
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

    const submit = <SubmitButton borderColor="teal" label="Submit" onClick={submitHandler}></SubmitButton>

    const running = <div className="flex flex-col items-center justify-center">
        <Spinner className="h-40"></Spinner>
    </div>

    return (
        <Form
            main={
                <div className="p-8">
                    {function () {
                        switch (state) {
                            case State.IDLE:
                                return formFields
                            case State.ERROR:
                                return formFields
                            case State.RUNNING:
                                return running
                            case State.SUCCESS:
                                return <div className="flex flex-col items-center justify-center mt-8 text-teal-400">
                                    <ShieldSuccess className="h-8 "></ShieldSuccess>
                                    <span className="text-xl font-bold ">Success</span>
                                </div>
                            case State.FAILURE:
                                return <div className="flex flex-col items-center justify-center mt-8 text-red-500">
                                    <ShieldFailure className="h-8 "></ShieldFailure>
                                    <span className="text-xl font-bold ">Failure</span>
                                </div>

                        }
                    }()}
                </div>
            }
            footer={<div>
                {
                    function () {
                        switch (state) {
                            case State.IDLE:
                                return submit
                            case State.ERROR:
                                return <p className="py-4 font-bold text-red-500">{errorMessage}</p>
                            case State.RUNNING:
                                return <p className="py-4 text-gray-700">Please wait until we find the HTLC from your counterparty.</p>
                            case State.SUCCESS:
                                return <p className="py-4 font-semibold text-gray-700">Thank you for using swapchain</p>
                            case State.FAILURE:
                                return <p className="py-4 font-semibold text-gray-700">{errorMessage}</p>

                        }
                    }()}
            </div>}
        ></Form >

    )


}