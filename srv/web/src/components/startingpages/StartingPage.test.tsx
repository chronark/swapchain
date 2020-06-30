import { Context } from 'react-responsive'
import StartingPage from './StartingPage'
import React from 'react'
import renderer from 'react-test-renderer'
import userEvent from '@testing-library/user-event'
import {render, screen} from '@testing-library/react'

describe('StartingPage', () => {
test('matches the mobile snapshot', () => {
const { container: isTabletOrMobileDevice } = render(
<Context.Provider value={{ width: 600 }}>
  <StartingPage />
</Context.Provider>
)
expect(isTabletOrMobileDevice).toMatchSnapshot()
})

test('matches the desktop snapshot', () => {
const { container: isDesktopOrLaptop } = render(
<Context.Provider value={{ width: 1224 }}>
  <StartingPage />
</Context.Provider>
)

expect(isDesktopOrLaptop).toMatchSnapshot()
})
const tree = renderer
.create(<StartingPage></StartingPage>)
.toJSON();
expect(tree).toMatchSnapshot();
})


test('selectOptions for timelock', () => {
  render(
  <select data-testid="select">
    <option data-testid="timelock1" value="2hours">2 hours</option>
    <option data-testid="timelock2" value="4hours">4 hours</option>
    <option data-testid="timelock3" value="6hours">6 hours</option>
  </select>
  )
  userEvent.selectOptions(screen.getByTestId('select'), ['2hours'])

  expect(screen.getByTestId('timelock1').selected).toBe(true)
  expect(screen.getByTestId('timelock2').selected).toBe(false)
  expect(screen.getByTestId('timelock3').selected).toBe(false)
})


test('selectOptions for txFees', () => {
  render(
  <select data-testid="select">
    <option data-testid="txFees1" value="5000">5000 Satoshi</option>
    <option data-testid="txFees2" value="10000">10000 Satoshi</option>
    <option data-testid="txFees3" value="15000">15000 Satoshi</option>
    <option data-testid="txFees4" value="20000">20000 Satoshi</option>
    <option data-testid="txFees5" value="25000">25000 Satoshi</option>
  </select>
  )
  userEvent.selectOptions(screen.getByTestId('select'), ['10000'])

  expect(screen.getByTestId('txFees1').selected).toBe(false)
  expect(screen.getByTestId('txFees2').selected).toBe(true)
  expect(screen.getByTestId('txFees3').selected).toBe(false)
  expect(screen.getByTestId('txFees4').selected).toBe(false)
  expect(screen.getByTestId('txFees5').selected).toBe(false)
})


test('selectOptions bidType', () => {
  render(
  <select data-testid="select">
    <option data-testid="bidType1" value="BTC">BTC</option>
    <option data-testid="bidType2" value="BTS">BTS</option>
  </select>
  )
  userEvent.selectOptions(screen.getByTestId('select'), ['BTC'])

  expect(screen.getByTestId('bidType1').selected).toBe(true)
  expect(screen.getByTestId('bidType2').selected).toBe(false)
})


test('selectOptions askType', () => {
  render(
  <select data-testid="select">
    <option data-testid="askType1" value="BTC">BTC</option>
    <option data-testid="askType2" value="BTS">BTS</option>
  </select>
  )
  userEvent.selectOptions(screen.getByTestId('select'), ['BTS'])

  expect(screen.getByTestId('askType1').selected).toBe(false)
  expect(screen.getByTestId('askType2').selected).toBe(true)
})
