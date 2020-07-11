import React from 'react';
import { Input } from './Input';
import renderer from 'react-test-renderer';

describe('number input', () => {
    it('number input renders correctly', () => {
        const tree = renderer
            .create(
                <Input type="number" placeholder="placeholder" name="name"></Input>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
})

describe('text input', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(
                <Input type="text" placeholder="placeholder" name="name"></Input>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    })
});