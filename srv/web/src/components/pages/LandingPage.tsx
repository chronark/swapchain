import React from "react"
import { ReactComponent as SwapchainLogo } from "../../icons/swapchainLogo.svg"
import { Link } from "react-router-dom"
export const LandingPage = () => {
    return (
        <div>
                      <div className="container mx-auto mt-4 md:mt-20 lg:px-16 xl:px-20">
                <div className="flex items-center">
                    <main className="max-w-screen-xl px-4 mx-auto mt-10 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center md:text-left">
                            <h2 className="text-2xl font-extrabold leading-10 tracking-tight text-gray-900 sm:text-2xl sm:leading-none md:text-5xl">
                                Cryptocurrency exchange
                                    <span className="text-teal-500"> without trust</span>
                            </h2>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Swapchain creates a trustless environment for the decentralized exchange of assets using Hashed Time Lock Contracts</p>
                            <div className="flex flex-col mt-5 space-y-4 text-center sm:flex-row sm:mt-8 sm:flex sm:justify-center md:justify-start sm:space-y-0 sm:space-x-4">

                                <Link to="/trade"   className="px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-teal-500 border border-transparent rounded-sm shadow hover:bg-teal-400 focus:outline-none md:py-4 md:text-lg md:px-10">Trade now</Link>
                                <a href="https://github.com/chronark/swapchain" className="px-8 py-3 text-base font-medium leading-6 text-teal-700 transition duration-150 ease-in-out bg-teal-100 border border-transparent rounded-sm hover:text-teal-500 focus:outline-none md:py-4 md:text-lg md:px-10">
                                    Learn more</a>
                            </div>
                        </div>
                    </main>
                    <SwapchainLogo className="hidden w-5/12 text-teal-500 fill-current md:inline-flex"></SwapchainLogo>
                </div>
            </div>
        </div>

    )
}
