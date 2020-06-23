import { Context } from 'react-responsive'
import { render } from '@testing-library/react'
import  ACCS from './ACCS'
import React from 'react'
 

describe('StartingPage', () => {
test('matches the mobile snapshot', () => {
    const { container: isTabletOrMobileDevice } = render(
    <Context.Provider value={{ width: 400 }}>
        <ACCS />
    </Context.Provider>
        )
    expect(isTabletOrMobileDevice).toMatchSnapshot()
    
})
  test('matches the desktop snapshot', () => {
    const { container: isDesktopOrLaptop } = render(
    <Context.Provider value={{ width: 1224 }}>
        <ACCS />
    </Context.Provider>
    )
    expect(isDesktopOrLaptop).toMatchSnapshot()
  })

})

