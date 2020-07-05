import React from 'react';
import {ProposerAccept} from './ProposerAccept';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<ProposerAccept></ProposerAccept>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});