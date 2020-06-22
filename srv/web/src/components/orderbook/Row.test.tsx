import React from 'react';
import {Row} from './Row';
import renderer from 'react-test-renderer';
jest.spyOn(Math, "random").mockImplementation(() => 1)
jest.spyOn(Date, "now").mockImplementation(() => 0)
it('renders correctly', () => {
    const order: Order = {
        selected: true,
        addressHash: "asdf",
        created: new Date(1),
        validUntil: new Date(1),
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