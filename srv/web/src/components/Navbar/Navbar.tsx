import React, { useState } from "react"
import { ReactComponent as SwapchainLogoDouble } from "../../icons/swapchainLogoDouble.svg"
import { Button } from "./Button"
import { ReactComponent as GithubLogo } from "../../icons/github.svg"


export const Navbar = () => {
    const [open, setOpen] = useState(false)

    const toggleMenu = () => {
        setOpen(!open)
    }


    return (
        <nav className="bg-white border-b border-gray-300" role="navigation">
            <div className="container flex flex-wrap items-center justify-between p-4 mx-auto md:flex-no-wrap">
                <div className="mr-4 md:mr-8">
                    <a href="/" rel="home">
                        <SwapchainLogoDouble className="h-10 text-teal-500 fill-current"></SwapchainLogoDouble>
                    </a>
                </div>
                <div className="ml-auto md:hidden">
                    <button onClick={toggleMenu} className="p-2 text-gray-400 hover:text-gray-900 focus:outline-none">
                        <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            {open ?
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                :
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>
                <div className={`${open ? "" : "hidden"} w-full md:w-auto md:flex-grow md:flex md:items-center`}>
                    <ul className="flex flex-col pt-4 mt-4 -mx-4 border-t md:flex-row md:items-center md:mx-0 md:mt-0 md:pt-0 md:mr-4 lg:mr-8 md:border-0">
                        <li>
                            <Button href="" label="Orderbook"></Button>
                        </li>
                        <li>
                            <Button href="" label="Documentation"></Button>
                        </li>
                        <li>
                            <Button href="" label="Orderbook"></Button>
                        </li>
                    </ul>
                    <ul className="flex flex-col pt-4 mt-4 -mx-4 border-t md:flex-row md:items-center md:mx-0 md:ml-auto md:mt-0 md:pt-0 md:border-0">
                        <li>
                            <a className="flex items-center px-4 text-gray-900 hover:text-gray-600" href="#" title="Link">
                                <GithubLogo className="h-8 fill-current"></GithubLogo>
                                <span className="ml-2 md:hidden">Github</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        //       
    )
}