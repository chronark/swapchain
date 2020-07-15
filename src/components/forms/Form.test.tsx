import React from "react"
import { Form } from "./Form"
import renderer from "react-test-renderer"

it("renders correctly", () => {
  const tree = renderer.create(<Form main={<h1>hello</h1>} footer={<h1>world</h1>}></Form>).toJSON()
  expect(tree).toMatchSnapshot()
})
