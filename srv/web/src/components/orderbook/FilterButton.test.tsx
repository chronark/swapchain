import React from 'react';
import {FilterButton} from './FilterButton';
import renderer from 'react-test-renderer';

jest.spyOn(Math, "random").mockImplementation(() => 1)
jest.spyOn(Date, "now").mockImplementation(() => 0)

it('renders correctly', () => {
  const tree = renderer
    .create(<FilterButton key="1" label="label" onClick={()=>{}}></FilterButton>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});