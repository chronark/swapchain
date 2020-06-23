import React from 'react';
import Orderbook from "./components/orderbook/Orderbook"
import { orderFactory} from "./components/orderbook/Orderbook"
import StartingPage from './components/StartingPage';
import AboutProject from './components/AboutProject';
import ACCS from './components/ACCS'; 




function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <StartingPage></StartingPage>
       <AboutProject></AboutProject>
       <ACCS></ACCS>
     <div className="p-20">
       

       <Orderbook orders={orderFactory(7)}></Orderbook>
     </div>
    </div>
  );
}

export default App;
