import React from 'react';
import {TakerAccept} from './TakerAccept';
import renderer from 'react-test-renderer';
import * as util from "../../util"
jest.mock("../../util")

jest.spyOn(util, "fakeAddress").mockReturnValue("randomLookingHash")


it('renders correctly', () => {
  const tree = renderer
    .create(<TakerAccept></TakerAccept>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});