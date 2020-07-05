import React from 'react';
import { RadioButton } from './RadioButton';
import renderer from 'react-test-renderer';

describe('with all attributes', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<RadioButton name="name" tag="tag" hint="hint" description="description"></RadioButton>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
})

describe('without hint', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<RadioButton name="name" tag="tag" description="description"></RadioButton>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
})

describe('without tag', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<RadioButton name="name" tag="tag" hint="hint" description="description"></RadioButton>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
})

describe('only name and description', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<RadioButton name="name" description="description"></RadioButton>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
})