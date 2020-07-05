
import React from 'react';
import { LandingPage } from './components/pages/LandingPage';
import { Navbar } from "./components/Navbar/Navbar"
import { NewOrder } from "./components/forms/NewOrder"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ComponentPage } from './components/ComponentPage';
import { TakerAccept } from './components/forms/TakerAccept';
import { OrderbookPage } from './components/pages/OrderbookPage';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Navbar></Navbar>
        <Switch>

          <Route path="/accept">
            <ComponentPage title="Accept an Atomic Cross Chain Swap">
              <TakerAccept></TakerAccept>
            </ComponentPage>

          </Route>

          <Route path="/orderbook">
            <ComponentPage>
              <OrderbookPage></OrderbookPage>
            </ComponentPage>

          </Route>

          <Route path="/propose">
            <ComponentPage title="Propose a new Atomic Cross Chain Swap">
              <NewOrder></NewOrder>
            </ComponentPage>
          </Route>

          <Route path="/">
            <LandingPage></LandingPage>
          </Route>

        </Switch>
      </Router>
    </div>
  )
}

export default App;


