import React, { useState } from "react"
import { ReactComponent as SwapchainLogo } from "../../icons/swapchainLogo.svg"
import { Modal } from "../util/Modal"
import { Link } from "react-router-dom"
export const LandingPage = () => {
    const [modalOpen, setModalOpen] = useState(false)


    return (
        <div>
            <Modal title="Choose what you want to do" open={modalOpen} close={() => setModalOpen(false)}>
            <div className="flex flex-col items-center w-full">

                <div className="flex flex-col items-center mt-4 space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
                    <Link to="/propose" className="flex flex-col justify-center w-full h-24 px-4 text-left bg-gray-100 border border-gray-200 rounded-sm md:w-1/2 hover:border-teal-400 hover:bg-white">

                        <span className="font-bold text-gray-900">Propose</span>
                        <p className="text-sm text-gray-500">a new Atomic Cross Chain Swap</p>
                    </Link>

                    <Link to="/accept" className="flex flex-col justify-center w-full h-24 px-4 text-left bg-gray-100 border border-gray-200 rounded-sm md:w-1/2 hover:border-teal-400 hover:bg-white">
                        <span className="font-bold text-gray-900 ">Accept</span>
                        <p className="text-sm text-gray-500">an Atomic Cross Chain Swap proposal</p>
                    </Link></div>
                    <p className="mt-4 text-sm text-gray-600">Lorem Ipsum more information about what this is an so on.</p>
            </div>
            </Modal>
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
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center md:justify-start">
                                <div className="shadow-lg">
                                    <button onClick={() => setModalOpen(true)} className="flex items-center justify-center px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-teal-500 border border-transparent rounded-sm hover:bg-teal-400 focus:outline-none md:py-4 md:text-lg md:px-10">Trade now</button>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <a href="#" className="flex items-center justify-center px-8 py-3 text-base font-medium leading-6 text-teal-700 transition duration-150 ease-in-out bg-teal-100 border border-transparent rounded-sm hover:text-teal-500 focus:outline-none md:py-4 md:text-lg md:px-10">
                                        View orders</a>
                                </div>
                            </div>
                        </div>
                    </main>
                    <SwapchainLogo className="hidden w-5/12 text-teal-500 fill-current md:inline-flex"></SwapchainLogo>
                </div>
            </div>
        </div>

    )
}
