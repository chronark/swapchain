import React, {Component} from 'react'
import logo from '../../icons/Logo_Swapchain_Bold_Subline.svg'
import axios from 'axios'


export function Orderbook() {
window.location.href = 'Orderbook.tsx'
}

export function ACCS() {
window.location.href = 'ACCS.tsx'
}

export function Project() {
window.location.href = 'AboutProject.tsx'
}

export function Github() {
window.location.href ='https://github.com/chronark/swapchain'
}

/**
 * This is a subset of all attributes from our mongo database.
 *
 * @interface Props
 */
export interface  Props { 
   address?: string, 
   timelock?: number, 
   txFees?: string, 
   bidType?: string, 
   askType?: string, 
   bidAmount?: number, 
   expiryDate?: string,
   askAmount?: number
}

/**
 * Create the handler that sends user accs input to our database.
 *
 * @private
 * @returns A post function to our database.
 */
export default class Form extends Component<Props> { 
   constructor(props: Props) {
      super(props)

      this.state = {
         address: '',
         timelock: '2 hours', 
         txFees: '5000 Satoshi', 
         bidType: 'BTS', 
         askType: 'BTC', 
         bidAmount: '', 
         expiryDate: '',
         askAmount: ''   
      }

   }
  
changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
      this.setState({ [e.target.name]: e.target.value })
  }
changeSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
   this.setState({ [e.target.name]: e.target.value })
}

submitHandler = (e: { preventDefault: () => void }) => {
      e.preventDefault()
      console.log(this.state)
      axios.post('/orderbook', this.state)
      .then(res => {
         console.log(res)
      })
      .catch(err => {
         console.log(err)})
}

render() { 
const address = this.props.address
const timelock = this.props.timelock
const txFees = this.props.txFees
const bidType = this.props.bidType
const askType = this.props.askType
const bidAmount = this.props.bidAmount
const expiryDate = this.props.expiryDate
const askAmount = this.props.askAmount

return (
<div>  
   <div className="block">
      <nav className="sm:block sm:flex sm:items-center sm:justify-between sm:flex-wrap sm:bg-white sm:p-6 flex justify-center flex-wrap bg-white p-6">
         <div className="sm:block sm:flex sm:items-center sm:flex-shrink-0 sm:text-white sm:mr-6 xs:flex sm:flex-shrink-0 sm:text-white xs:mt-4">
            <img src={logo} alt="cool swapchain gif" width="130" height="130"/>
         </div>
         <div className="block">
            <span>
               <div className="justify-content-center flex-wrap bg-white p-2 text-black font-bold p-2 text-center mt-6">Peer to Peer trading across blockchains - entirely trustless!<br/></div>
            </span>
            <span>
               <div className="justify-content-center flex-wrap bg-white p-2 text-black font-bold p-2 text-center mb-8">Atomic Cross-Chain Swaps powered by Swapchain.</div>
            </span>
         </div>
            <button onClick={ACCS} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded mr-8 mb-8 sm:mr-0">
            What are ACCS?
            </button>
            <button onClick={Project} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded mb-8">
            About the Project
            </button>
            <button onClick={Github} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded xs:content-center sm:mb-8">
            GitHub
            </button>  
      </nav>
      <span className="block bg-green-500 p-10 text-center">
         <form className="block w-full sm:max-w-6xl" onSubmit ={this.submitHandler}>
            <div className="block flex flex-wrap sm:mx-64 sm:mb-2 sm:max-w-lg">
               <div className="block w-full sm:px-3 sm:mb-6">
               </div>
               <div className="w-full px-3 mb-6">
                  <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2 mt-4">
                  Your Crypto Address
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mt-4" placeholder="1N52wHoVR79PMDishab2XmRHsbekC" type="text" name="address" value={address} onChange={this.changeHandler}></input>
               </div>
               <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2">
                  Set your Timelock
                  </label>
                  <div className="relative">
                     <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mt-4" name="timelock" value={timelock} onChange={this.changeSelectHandler}>
                        <option>2 hours</option>
                        <option>4 hours</option>
                        <option>6 hours</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                     </div>
                  </div>
                  <p className="text-yellow-500 text-xs italic">* You can access your crypto as soon as the timelock expires.</p>
               </div>
               <div className="w-full md:w-1/2 px-3 mb-6">
               <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2">
                  Set your Transaction Fee
                  </label>
                  <div className="relative">
                     <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mt-4"  name="txFees" value={txFees} onChange={this.changeSelectHandler}>
                           <option>5000 Satoshi</option>
                           <option>10000 Satoshi</option>
                           <option>15000 Satoshi</option>
                           <option>20000 Satoshi</option>
                           <option>25000 Satoshi</option>
                        </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                     </div>
                  </div>
                  <p className="text-yellow-500 text-xs italic">* The higher the fees, the faster your transaction is processed.</p>
               </div>
            </div>
            <div className="flex sm:mx-64 justify-center sm:justify-start">
            <div className="sm:w-1/3 sm:px-3 sm:mb-6 sm:mb-6 mb-6 mx-10 sm:mx-0">
                  <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2">
                  Bid
                  </label>
                  <div className="relative">
                     <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="bidType" value={bidType} onChange={this.changeSelectHandler}>
                        <option>BTS</option>
                        <option>BTC</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                     </div>
                  </div>
               </div>
               <div className="sm:w-1/3 sm:px-3 sm:mb-6 sm:mb-6 mb-6 mx-10 sm:mx-0">
                  <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2">
                  Ask
                  </label>
                  <div className="relative">
                     <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="askType" value={askType} onChange={this.changeSelectHandler}>
                     <option>BTC</option>   
                     <option>BTS</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex text-center sm:mx-64 md:mb-6 xs:justify-center sm:justify-start">
               <div className="w-full md:w-1/3 px-3 mb-6 md:mb-6">
                  <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2">
                  Bid Amount
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" name="bidAmount" value={bidAmount} onChange={this.changeHandler} placeholder="1 BTC"></input>
                  <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2 mt-5">
                  Expiry Date for your order
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" name="expiryDate" value={expiryDate} onChange={this.changeHandler} placeholder="DD/MM/YY"></input>
               </div>
               <div className="w-full md:w-1/3 px-3 mb-6 md:mb-6">
                  <label className="block uppercase tracking-wide text-black-700 text-xs font-bold mb-2">
                  Ask Amount
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" name="askAmount" value={askAmount} onChange={this.changeHandler} placeholder="10000 BTS"></input>
               </div>
            </div>
            <div className="flex flex-wrap text-center">
               <div className="w-full px-3">
               <input type="submit" value="Send to Orderbook!" className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded mr-8 mt-8"></input>
                  <button onClick={Orderbook} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded mr-8 mt-8">Find a match!</button>
                  <button onClick={ACCS} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded mr-8 mt-8">Already have a recipient?</button>
                  <button onClick={Orderbook} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded mr-8 mt-8">Browse Orderbook</button>
                  <button onClick={ACCS} className="bg-white hover:bg-green-500 text-black font-bold py-2 px-4 border border-black-700 rounded mr-8 mt-8">Edit your orders</button>
               </div>
            </div>
         </form>
      </span>
   </div>
   </div>
)
}
}


