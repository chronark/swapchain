import React from 'react';
import {Label} from './Label';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Label main={<div>main</div>} footer={<h1>footer</h1>}></Label>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});