
import React from 'react';
import Orderbook from "./components/orderbook/Orderbook"
import { orderFactory} from "./components/orderbook/Orderbook"
import AboutProject from './components/startingpages/AboutProject';
import ACCS from './components/startingpages/ACCS'; 
import StartingPage from './components/startingpages/StartingPage'


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <StartingPage/>
      <ACCS></ACCS>
      <AboutProject></AboutProject>
     <div className="p-20">
       

       <Orderbook orders={orderFactory(7)}></Orderbook>
     </div>
    </div>
  )
}

export default App;



