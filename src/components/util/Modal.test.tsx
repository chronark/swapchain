import React from "react"
import { Modal } from "./Modal"
import renderer from "react-test-renderer"

it("renders a closed Modal correctly", () => {
  const tree = renderer
    .create(
      <Modal close={() => {}} open={false} title="Hello">
        <h1>Hello</h1>
      </Modal>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it("renders an open Modal correctly", () => {
  const tree = renderer
    .create(
      <Modal close={() => {}} open={true} title="Hello">
        <h1>Hello</h1>
      </Modal>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it("renders an open Modal without title correctly", () => {
  const tree = renderer
    .create(
      <Modal close={() => {}} open={true}>
        <h1>Hello</h1>
      </Modal>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
