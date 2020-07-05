import React from 'react';
import {OrderbookPage} from './OrderbookPage';
import renderer from 'react-test-renderer';
import * as orderbook from "../orderbook/Orderbook"
jest.mock("../orderbook/Orderbook")

jest.spyOn(orderbook, "Orderbook").mockReturnValue(<div></div>)

it('renders correctly', () => {
  const tree = renderer
    .create(<OrderbookPage></OrderbookPage>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});