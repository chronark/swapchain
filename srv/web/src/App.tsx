
import React, {useState} from 'react';
import { LandingPage } from './components/landingPage/LandingPage';
import { Navbar } from "./components/Navbar/Navbar"
import { CancelOrder } from './components/forms/CancelOrder';
import { CounterpartyAccept } from './components/forms/CounterpartyAccept';
import Modal from './components/util/Modal';
import { NewOrder } from './components/forms/NewOrder';



function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar></Navbar>
      <Modal title="Some snappy title" open={true} close={() => { }}>
       <NewOrder></NewOrder>
      </Modal> 
      <LandingPage></LandingPage> 

    </div>
  )
}

export default App;


