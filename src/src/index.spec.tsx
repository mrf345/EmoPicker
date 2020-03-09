import React from 'react'
import { render } from '@testing-library/react'

import Main from './index'
import Settings from './components/Settings'

describe('Main component sanity checks 🧑‍🔧', () => {
    const self = {component: render(<Main />)}

    beforeEach(() => { self.component = render(<Main />) })

    test('Check main component snapshot', () => {
        expect(self.component).toMatchSnapshot()
    })

    test('Check settings component snapshot', () => {
        const settings = {shortcut: 'testing',
                          backgroundColor: 'testing',
                          fontColor: 'testing',
                          afterSelection: 'nothing'}
        const afterSelection = {'nothing': {action: () => {},
                                            description: 'Do nothing'}}

        expect(render(<Settings settings={settings}
                                applySettings={() => {}}
                                handleStateChange={() => {}}
                                afterSelection={afterSelection}/>)).toMatchSnapshot()
    })
})
