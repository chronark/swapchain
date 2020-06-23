import { Context } from 'react-responsive'
import { render } from '@testing-library/react'
import StartingPage from './StartingPage'
import React from 'react'
 

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

})

