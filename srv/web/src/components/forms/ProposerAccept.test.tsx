import React from 'react';
import {ProposerAccept} from './ProposerAccept';
import renderer from 'react-test-renderer';

import * as util from "../../util"
jest.mock("../../util")

jest.spyOn(util, "fakeAddress").mockReturnValue("randomLookingHash")


it('renders correctly', () => {
  const tree = renderer
    .create(<ProposerAccept></ProposerAccept>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});