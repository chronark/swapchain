
import React, {useState} from 'react';
import { LandingPage } from './components/landingPage/LandingPage';
import { Navbar } from "./components/Navbar/Navbar"
import { CancelOrder } from './components/forms/CancelOrder';
import { NewOrder } from './components/forms/NewOrder';
import Modal from './components/util/Modal';



function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar></Navbar>
      <Modal title="Cancel your order" open={true} close={() => { }}>
       <CancelOrder></CancelOrder>
      </Modal> 
      <LandingPage></LandingPage> 

    </div>
  )
}

export default App;


