import React from 'react';
import { Navbar } from './Navbar';
import renderer from 'react-test-renderer';
import {
    BrowserRouter as Router,
} from "react-router-dom";
it('renders correctly', () => {
    const tree = renderer
        .create(
            <Router>
                <Navbar></Navbar>
            </Router>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});