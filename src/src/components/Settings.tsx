import React from 'react'

import { CommonProps } from '../index'
import ActionButton from './ActionButton'
import { entitle } from '../utils'


interface SettingsProps extends CommonProps {
    applySettings():void
}


export default class Settings extends React.Component<SettingsProps> {
    handleShortcutChange = (event:any) => {
        const value = event.target.value
        const parsedValue = value.split('+')
                                 .map(entitle)
                                 .join('+')

        this.props.handleStateChange('shortcut', parsedValue)
        event.target.value = parsedValue
    }

    render() {
        return (
            <div className="settings">
                <div>
                    <label htmlFor="shortcut">Keyboard shortcut:</label>
                    <input type="text"
                           name="shortcut"
                           defaultValue={this.props.settings?.shortcut}
                           onChange={this.handleShortcutChange} />
                </div>
                <div>
                    <label htmlFor="afterSelection">After selecting emoji:</label>
                    <select name="afterSelection"
                            value={this.props.settings?.afterSelection}
                            onChange={(e) => { this.props.handleStateChange('afterSelection', e.target.value) }}>
                        {Object.entries(this.props.afterSelection || {})
                               .map(([value, obj], i) => (
                                    <option key={i.toString()} value={value}>{obj.description}</option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="backgroundColor">Interface background color:</label>
                    <input type="text"
                           name="backgroundColor"
                           defaultValue={this.props.settings?.backgroundColor}
                           onChange={(e) => { this.props.handleStateChange('backgroundColor', e.target.value) }} />
                </div>
                <div>
                    <label htmlFor="fontColor">Interface font color:</label>
                    <input type="text"
                           name="fontColor"
                           defaultValue={this.props.settings?.fontColor}
                           onChange={(e) => { this.props.handleStateChange('fontColor', e.target.value) }} />
                </div>
                <ActionButton label="Save"
                              onClick={this.props.applySettings} />
            </div>
        )
    }
}
