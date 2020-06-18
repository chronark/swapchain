import React from 'react';
import logo from './logo.svg';
import Orderbook from "./components/Orderbook"
import { orderFactory} from "./components/Orderbook"




function App() {
  return (
    <div className="bg-gray-100 h-screen">
     <div className="p-20">

       <Orderbook orders={orderFactory(15)}></Orderbook>
     </div>
    </div>
  );
}

export default App;
