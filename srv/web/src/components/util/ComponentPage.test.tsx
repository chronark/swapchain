import React from 'react';
import {ComponentPage} from './ComponentPage';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<ComponentPage title="title"><h1>Hello World</h1></ComponentPage>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});