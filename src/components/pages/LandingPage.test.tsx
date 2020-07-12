import React from "react"
import { LandingPage } from "./LandingPage"
import renderer from "react-test-renderer"
import { BrowserRouter } from "react-router-dom"

it("renders correctly", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <LandingPage></LandingPage>
      </BrowserRouter>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
