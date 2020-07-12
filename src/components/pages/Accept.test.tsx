import React from "react"
import { Accept } from "./Accept"
import renderer from "react-test-renderer"
import * as util from "../../pkg/util/util"
jest.mock("../../pkg/util/util")

jest.spyOn(util, "fakeKey").mockReturnValue("randomLookingHash")

it("renders correctly", () => {
  const tree = renderer.create(<Accept></Accept>).toJSON()
  expect(tree).toMatchSnapshot()
})
