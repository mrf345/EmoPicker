import React from 'react'

import Constants from '../constants'
import { displayInNewWindow } from '../utils'

interface ErrorHandlerState {
    errors:Error[]
}


export default class ErrorHandler extends React.Component<{}, ErrorHandlerState> {
    openedWindows:Window[]

    constructor(props:{}) {
        super(props)

        this.openedWindows = []
        this.state = {errors: []}
    }

    componentDidCatch(error:Error) {
        if (error.stack) this.openedWindows.push(displayInNewWindow(error.stack))
        this.setState((state, props) => {
            return {errors: [...new Set([...state.errors, error])]}
        })
    }

    render() {
        return this.state.errors.length
            ? <div className="main" style={{backgroundColor: Constants.DEFAULT_BACKGROUND,
                                             justifyContent: 'space-around',
                                             textAlign: 'center'}}>
                        <h3> Something went wrong <br/><br/> 😢</h3>
                        <p>Check out the error stack  🔎</p>
              </div>
            : this.props.children
    }
}
