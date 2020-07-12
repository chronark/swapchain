import React from "react"
import { Label } from "./Label"
import renderer from "react-test-renderer"

it("renders correctly", () => {
  const tree = renderer.create(<Label label="label"></Label>).toJSON()
  expect(tree).toMatchSnapshot()
})
