import React from "react"
import { Protip } from "./Protip"
import renderer from "react-test-renderer"
import { Network } from "./enums"

it("renders correctly for testnet", () => {
  const tree = renderer.create(<Protip network={Network.TESTNET}></Protip>).toJSON()
  expect(tree).toMatchSnapshot()
})

it("renders correctly for mainnet", () => {
  const tree = renderer.create(<Protip network={Network.MAINNET}></Protip>).toJSON()
  expect(tree).toMatchSnapshot()
})
