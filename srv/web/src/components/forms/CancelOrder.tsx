import React, { useState } from "react"
import { fakeAddress } from "../../util"
import { Label } from "./Label"
import { Input } from "./Input"
import {ReactComponent as Annotation} from "../../icons/annotation.svg"
import { ActionButton } from "./ActionButton"

export const CancelOrder = () => {
      return (
        <div className="container mx-auto">

            <section className="max-w-lg mt-12">
    
                <div className="flex-grow ">
                    <Label label="Your private key"></Label>
                    <Input type="text" placeholder={fakeAddress(30)}></Input>
                </div>

                <p className="mt-2 text-sm text-center text-gray-500">
                    Your private key will never leave your browser, it is only used to authorize this request. <a href="" className="relative text-xs text-blue-500">Read more in our docs. <Annotation className="absolute right-0 h-4 -mr-4"></Annotation> </a>
                </p>
            </section>

           
            <footer className="flex items-center justify-around pt-12 mt-8 text-center border-t border-gray-300">
                <ActionButton color="orange" onClick={() => {}}></ActionButton>


            </footer>
        </div>
    )
}