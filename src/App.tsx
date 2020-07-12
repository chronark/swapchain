import React from "react"
import { LandingPage } from "./components/pages/LandingPage"
import { Navbar } from "./components/Navbar/Navbar"
import { Propose } from "./components/forms/Propose"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { ComponentPage } from "./components/util/ComponentPage"
import { Accept } from "./components/forms/Accept"
import { OrderbookPage } from "./components/pages/OrderbookPage"
import { TradingPage } from "./components/pages/TradingPage"

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Navbar></Navbar>
        <Switch>
          <Route path="/trade">
            <ComponentPage>
              <TradingPage></TradingPage>
            </ComponentPage>
          </Route>

          <Route path="/propose">
            <ComponentPage>
              <Propose></Propose>
            </ComponentPage>
          </Route>

          <Route path="/accept">
            <ComponentPage>
              <Accept></Accept>
            </ComponentPage>
          </Route>

          <Route path="/orderbook">
            <div className="container flex items-center justify-center mx-auto">
              <div className="max-w-4xl px-10 mt-8 -mb-8">
                <h3 className="text-sm text-center text-gray-700 text-bold">
                  The orderbook is currently just a proof of concept, the orders you see here are generated randomly.
                  You can filter them using the filters on the left side. There is also one order with the address
                  "helloamos".
                </h3>
              </div>
            </div>
            <ComponentPage>
              <OrderbookPage></OrderbookPage>
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

export default App
