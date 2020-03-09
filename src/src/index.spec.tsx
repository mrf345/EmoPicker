import React from 'react'
import { render } from '@testing-library/react'

import Main from './index'

describe('Main component sanity checks 🧑‍🔧', () => {
    const self = {component: render(<Main />)}

    beforeEach(() => { self.component = render(<Main />) })

    test('Check main component snapshot', () => {
        expect(self.component).toMatchSnapshot()
    })
})
