import React from 'react';
import {Propose} from './Propose';
import renderer from 'react-test-renderer';
import * as util from "../../util"
jest.mock("../../util")

jest.spyOn(util, "fakeAddress").mockReturnValue("randomLookingHash")
it('renders correctly', () => {
  const tree = renderer
    .create(<Propose></Propose>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});