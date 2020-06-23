import { Context } from 'react-responsive'
import { render } from '@testing-library/react'
import React from 'react'
import AboutProject from './AboutProject'
 
describe('StartingPage', () => {
test('matches the mobile snapshot', () => {
    const { container: isTabletOrMobileDevice } = render(
    <Context.Provider value={{ width: 400 }}>
        <AboutProject />
    </Context.Provider>
        )
    expect(isTabletOrMobileDevice).toMatchSnapshot()
    
})
  test('matches the desktop snapshot', () => {
    const { container: isDesktopOrLaptop } = render(
    <Context.Provider value={{ width: 1224 }}>
        <AboutProject />
    </Context.Provider>
    )
    expect(isDesktopOrLaptop).toMatchSnapshot()
  })

})
