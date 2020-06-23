import React from 'react';
import {Row} from './Row';
import renderer from 'react-test-renderer';
import {Order} from "./Orderbook"
jest.spyOn(Math, "random").mockImplementation(() => 1)
jest.spyOn(Date.prototype, "toLocaleString").mockImplementation(() => "IAmADate")
jest.spyOn(Date.prototype, "toLocaleTimeString").mockImplementation(() => "IAmADate")

it('renders correctly', () => {
    const order: Order = {
        selected: true,
        addressHash: "asdf",
        created: new Date(),
        validUntil: new Date(),
        status: { label: "label", color: "red" },
        give: {
            asset: "BTC",
            value: 1
        },
        exchangeRate: 1,
        receive: {
            asset: "BTS",
            value: 1,
        }
    }

    const tree = renderer
        .create(<Row order={order} onClick={()=>{}}></Row>)
       .toJSON();
    expect(tree).toMatchSnapshot();
});