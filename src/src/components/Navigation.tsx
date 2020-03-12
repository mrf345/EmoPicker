import React from 'react'
import { NavLink } from 'react-router-dom'

import ActionButton from './ActionButton'


export default class Navigation extends React.Component {
    render() {
        return (
            <div className="navigation">
                <NavLink exact
                         to="/"
                         activeClassName="hidden">
                    <ActionButton label="Go back" />
                </NavLink>
                <NavLink exact
                         to="/settings"
                         activeClassName="hidden">
                    <ActionButton label="Settings" />
                </NavLink>
            </div>
        )
    }
}
