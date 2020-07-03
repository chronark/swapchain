
import React from 'react';
import { LandingPage } from './components/landingPage/LandingPage';
import { Navbar } from "./components/Navbar/Navbar"
import { CancelOrder } from './components/forms/CancelOrder';
import Modal from './components/util/Modal';
import { NewOrder } from './components/forms/NewOrder';
import { ProposerAccept } from './components/forms/ProposerAccept';



function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar></Navbar>
      <Modal title="Some snappy title" open={true} close={() => { }}>
       <ProposerAccept></ProposerAccept>
      </Modal> 
      <LandingPage></LandingPage> 

    </div>
  )
}

export default App;


