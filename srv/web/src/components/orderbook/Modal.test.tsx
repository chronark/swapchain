import React from 'react';
import Modal from './Modal';
import renderer from 'react-test-renderer';
import { Order } from './Orderbook';


jest.spyOn(Math, "random").mockImplementation(() => 1)
jest.spyOn(Date.prototype, "toLocaleString").mockImplementation(() => "IAmADate")
jest.spyOn(Date.prototype, "toLocaleTimeString").mockImplementation(() => "IAmADate")

it('renders correctly if selected', () => {
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

    const testCases = [true, false]
    testCases.forEach(open => {

        const tree = renderer
            .create(<Modal close={() => { }}
                open={open}
                order={order}></Modal>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    })
})

