import React from "react"
import logo from './components/assets/Logo_Swapchain_Bold_Subline.svg'
import { useMediaQuery } from 'react-responsive'


export function Home() {
    window.location.href = './StartingPage.tsx';
  }

export function ACCS() {
    window.location.href ='./ACCS.tsx'
}

export function Github() {
  window.location.href ='https://github.com/chronark/swapchain'
}


export default () => {

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 1224px)'
      })
      const isTabletOrMobileDevice = useMediaQuery({
        query: '(max-device-width: 1224px)'})

    return (
    <div>
    {isDesktopOrLaptop &&
    <p>
        <div className="">
        <nav className="flex items-center justify-between flex-wrap bg-white p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6 ">
            <img src={logo} alt="swapchain logo" width="100" height="100" className="ml-10" />
        </div>
        <div className="">
        </div>
                <button onClick={Home} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded">
                Home
                </button>
                <button onClick={ACCS} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded">
                What are ACCS?
                </button>
                <button onClick={Github} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded">
                GitHub
                </button>  
        </nav>
        <section className="bg-green-500 p-10">
                <form className="w-full">
                <div className="flex flex-wrap mx-64 mb-2 max-w-lg">
                </div>
                <h1 className= "text-center font-bold">About the Project</h1>
                <br></br>
                <p className="text-center">Swapchain is a software product being developed by a group of students from the Friedrich-Alexander-University Erlangen-Nuremberg (FAU), in the frame of the course "Agile Methods and Open Source" (AMOS) held by the Open Source Software Chair of Prof. Dr. Dirk Riehle. As the project unfolds according to the "Agile Methods" principles, roles and responsibilites can be clearly allocated</p>
                <div className="flex flex-wrap mx-64 mb-6">
                </div>    
            </form>
        </section>
        </div> 
        </p>}
        {isTabletOrMobileDevice &&
        <p>
        <div className="">
        <nav className="mb-6">
        <div className="">
            <img src={logo} alt="swapchain logo" width="100" height="100" className="mx-auto mt-10 mb-5" />
        </div>
        <div className="flex justify-between ml-2 mr-2">
                <button onClick={Home} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded">
                Home
                </button>
                <button onClick={ACCS} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded">
                What are ACCS?
                </button>
                <button onClick={Github} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded">
                GitHub
                </button>  
        </div>
        </nav>
        <section className="bg-green-500 p-10">
                <form className="w-full">
                <div className="flex flex-wrap mx-64 mb-2 max-w-lg">
                </div>
                <h1 className= "text-center font-bold">About the Project</h1>
                <br></br>
                <p className="text-center">Swapchain is a software product being developed by a group of students from the Friedrich-Alexander-University Erlangen-Nuremberg (FAU), in the frame of the course "Agile Methods and Open Source" (AMOS) held by the Open Source Software Chair of Prof. Dr. Dirk Riehle. As the project unfolds according to the "Agile Methods" principles, roles and responsibilites can be clearly allocated.</p>
                <div className="flex flex-wrap mx-64 mb-6">
                </div>    
            </form>
        </section>
        </div>   
    </p>}
    </div>
                
        )
    }