import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import {  HashRouter as Router, Route } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'

import './index.css'
import app from '../package.json'
import Navigation from './components/Navigation'
import Search from './components/Search'
import Settings from './components/Settings'
import ErrorHandler from './components/ErrorHandler'
import Constants from './constants'
import {
    registerShortcut, storeObjectLocally, entitle, getWindow, getTray,
    unregisterShortcut } from './utils'


declare global {
    interface Window { nw: any }
}


export interface CommonProps {
    [index:string]:any
    handleStateChange(key:string, value:any):any
    getAfterSelectionAction?():Function
    searchValue?:string
    showWindow?:boolean
    searchRef?:any
    afterSelection?:afterSelection
    settings?: {
        shortcut?:string,
        backgroundColor?:string
        fontColor?:string
        afterSelection?:string
    }
}


interface MainState {
    [index:string]:any
    searchValue:string
    settings: {
        [index:string]:any
        shortcut:string,
        backgroundColor:string
        afterSelection:string
    }
}


interface afterSelection {
    [key:string]:{
        action:Function
        description:string
    }
}


export default class Main extends React.Component<{}, MainState> {
    afterSelection:afterSelection
    searchRef:any
    tray:any
    shortcut:any

    constructor(props:{}) {
        super(props)

        this.shortcut = undefined
        this.searchRef = React.createRef()
        this.tray = getTray({title: app.window.title,
                             icon: app.window.icon})
        this.state = {searchValue: '',
                      showWindow: true,
                      settings: {shortcut: localStorage.getItem('shortcut') || Constants.DEFAULT_SHORT_CUT,
                                 backgroundColor: localStorage.getItem('backgroundColor') || Constants.DEFAULT_BACKGROUND,
                                 fontColor: localStorage.getItem('fontColor') || Constants.DEFAULT_FONT_COLOR,
                                 afterSelection: localStorage.getItem('afterSelection') || Constants.DEFAULT_AFTER_SELECTION}}
        this.afterSelection = {minimize: {action: () => getWindow().minimize(),
                                          description: 'Minimize window'},
                               hide: {action: () => getWindow().hide(),
                                      description: 'Hide window'},
                               nothing: {action: () => {},
                                         description: 'Leave it as it is'}}
    }

    componentDidMount() {
        this.applySettings()
        this.gotoHomeAndFocus()
        this.tray.on('click', this.toggleWindowVisibility)
    }

    handleStateChange = (key:string, value:any) => {
        this.setState<never>((state, props) => state.hasOwnProperty(key)
            ? {[key]: value}
            : {settings: {...state.settings, [key]: value}})
    }

    gotoHomeAndFocus = () => {
        const nwWindow = getWindow()

        nwWindow.show()
        nwWindow.focus()
        if (this.searchRef.current) this.searchRef.current.instanceRef.search.current.focus()
    }

    toggleWindowVisibility = () => {
        const visible = this.state.showWindow

        if (visible) this.getAfterSelectionAction()()
        else this.gotoHomeAndFocus()

        this.handleStateChange('showWindow', !visible)
    }

    applySettings = (event?:any) => {
        storeObjectLocally(this.state.settings)

        if (this.shortcut) unregisterShortcut(this.shortcut)
        this.shortcut = registerShortcut(entitle(this.state.settings.shortcut),
                                         this.toggleWindowVisibility)
    }

    getAfterSelectionAction = ():Function => {
        const afterSelection = this.afterSelection[this.state.settings.afterSelection]

        return afterSelection.action
    }

    render() {
        const theme = {backgroundColor: this.state.settings.backgroundColor,
                       color: this.state.settings.fontColor}
        const commonProps = {handleStateChange: this.handleStateChange,
                             settings: this.state.settings}

        return (
            <ErrorHandler>
                <Router>
                    <div className="main" style={theme}>
                        <Navigation />
                        <Route exact
                               path="/"
                               render={
                                   (props:RouteComponentProps) => <Search
                                        searchValue={this.state.searchValue}
                                        searchRef={this.searchRef}
                                        getAfterSelectionAction={this.getAfterSelectionAction}
                                        {...commonProps}
                                        {...props} />
                               } />
                        <Route exact
                               path="/settings"
                               render={
                                   (props:RouteComponentProps) => <Settings
                                        searchRef={this.searchRef}
                                        afterSelection={this.afterSelection}
                                        applySettings={this.applySettings}
                                        {...commonProps}
                                        {...props} />
                               } />
                    </div>
                </Router>
            </ErrorHandler>
        )
    }
}


ReactDOM.render(<Main />, document.body)
serviceWorker.register()
