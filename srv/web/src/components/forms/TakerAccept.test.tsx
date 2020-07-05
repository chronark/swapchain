import React from 'react';
import {TakerAccept} from './TakerAccept';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<TakerAccept></TakerAccept>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});