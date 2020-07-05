import React from 'react';
import {OrderbookPage} from './OrderbookPage';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<OrderbookPage></OrderbookPage>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});