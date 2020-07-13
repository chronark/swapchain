import React from "react"
import { Spinner } from "./Spinner"
import renderer from "react-test-renderer"

it("renders correctly", () => {
  const tree = renderer.create(<Spinner></Spinner>).toJSON()
  expect(tree).toMatchSnapshot()
})
