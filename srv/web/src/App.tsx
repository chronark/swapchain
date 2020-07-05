
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

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Navbar></Navbar>
        <Switch>
        <Route path="/accept">
            <ComponentPage>
              <h1 className="py-4 text-3xl font-bold leading-tight text-gray-900">
                Accept an Atomic Cross Chain Swap</h1>
              <TakerAccept></TakerAccept>
            </ComponentPage>
            
          </Route>
          <Route path="/propose">
            <ComponentPage>
              <h1 className="py-4 text-3xl font-bold leading-tight text-gray-900">
                Propose a new Atomic Cross Chain Swap</h1>
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


