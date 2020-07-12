import React from "react"
import { TradingPage } from "./TradingPage"
import renderer from "react-test-renderer"
import { BrowserRouter } from "react-router-dom"

it("renders correctly", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <TradingPage></TradingPage>
      </BrowserRouter>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
