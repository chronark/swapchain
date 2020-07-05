import React from 'react';
import {NewOrder} from './NewOrder';
import renderer from 'react-test-renderer';
import * as util from "../../util"
jest.mock("../../util")

jest.spyOn(util, "fakeAddress").mockReturnValue("randomLookingHash")
it('renders correctly', () => {
  const tree = renderer
    .create(<NewOrder></NewOrder>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});