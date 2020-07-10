import React from 'react';
import {SubmitButton} from './SubmitButton';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<SubmitButton borderColor="teal" label="SubmitButton" onClick={() => {}}></SubmitButton>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});