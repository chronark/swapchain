import React from "react"
import logo from '../../icons/Logo_Swapchain_Bold_Subline.svg'

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

return (
<div>
      <nav className="xs:mb-6 sm:flex sm:items-center sm:justify-between sm:flex-wrap sm:bg-white sm:p-6">
         <div className="sm:flex sm:items-center sm:flex-shrink-0 sm:text-white sm:mr-6 ">
            <img src={logo} alt="swapchain logo" width="100" height="100" className="mx-auto mt-10 mb-5 sm:ml-10" />
         </div>
            <div className="flex justify-between mx-2 justify-around mb-4 sm:mb-0">
               <button onClick={Home} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded sm:mr-4">
               Home
               </button>
               <button onClick={ACCS} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded sm:mr-4">
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
               <div className="text-center">Swapchain is a software product being developed by a group of students from the Friedrich-Alexander-University Erlangen-Nuremberg (FAU), in the frame of the course "Agile Methods and Open Source" (AMOS) held by the Open Source Software Chair of Prof. Dr. Dirk Riehle. As the project unfolds according to the "Agile Methods" principles, roles and responsibilites can be clearly allocated.</div>
               <div className="flex flex-wrap mx-64 mb-6">
            </div>
         </form>
      </section>
   </div>
)
}