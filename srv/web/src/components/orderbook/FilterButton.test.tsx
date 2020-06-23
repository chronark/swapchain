import React from 'react';
import {FilterButton} from './FilterButton';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<FilterButton key="1" label="label" onClick={()=>{}}></FilterButton>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});