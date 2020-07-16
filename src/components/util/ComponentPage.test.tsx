import React from "react"
import { ComponentPage } from "./ComponentPage"
import renderer from "react-test-renderer"

it("renders correctly without bg", () => {
  const tree = renderer
    .create(
      <ComponentPage title="title">
        <h1>Hello World</h1>
      </ComponentPage>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it("renders correctly with bg", () => {
  const tree = renderer
    .create(
      <ComponentPage title="title" bg="bg-red-200">
        <h1>Hello World</h1>
      </ComponentPage>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
