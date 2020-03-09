import React from 'react'

import { CommonProps } from '../index'
import { parseClasses } from '../utils'


interface ButtonProps extends CommonProps {
    label:string
    showSettings:boolean
    secondaryLabel:string
    style?:string
}


export default class ToggleButton extends React.Component<ButtonProps> {
    constructor(props:ButtonProps) {
        super(props)
    }

    render() {
        const showSettings = this.props.showSettings

        return (
            <button className={this.props.style}
                    onClick={e => this.props.handleStateChange('showSettings', !showSettings)}>
                {this.props.showSettings ? this.props.secondaryLabel : this.props.label}
            </button>
        )
    }
}
