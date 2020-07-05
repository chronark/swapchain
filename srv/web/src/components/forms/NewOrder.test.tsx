import React from 'react';
import {NewOrder} from './NewOrder';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<NewOrder></NewOrder>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});