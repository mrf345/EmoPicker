import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

import './index.css'
import app from '../package.json'
import Search from './components/Search'
import Settings from './components/Settings'
import ToggleButton from './components/ToggleButton'
import Constants from './constants'
import { registerShortcut, storeObjectLocally, entitle, getWindow, getTray } from './utils'


declare global {
    interface Window { nw: any }
}


export interface CommonProps {
    [index:string]:any
    handleStateChange(key:string, value:any):any
    getAfterSelectionAction?():Function
    searchValue?:string    
    showSettings?:boolean
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
    showSettings:boolean
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

    constructor(props:{}) {
        super(props)

        this.searchRef = React.createRef()
        this.tray = getTray({title: app.window.title,
                             icon: app.window.icon})
        this.state = {searchValue: '',
                      showSettings: false,
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

        this.handleStateChange('showSettings', false)
        nwWindow.show()
        nwWindow.focus()
        this.searchRef.current.instanceRef.search.current.focus()
    }

    toggleWindowVisibility = () => {
        const visible = this.state.showWindow

        if (visible) this.getAfterSelectionAction()()
        else this.gotoHomeAndFocus()

        this.handleStateChange('showWindow', !visible)
    }

    applySettings = (event?:any) => {
        registerShortcut(entitle(this.state.settings.shortcut), this.toggleWindowVisibility)
        storeObjectLocally(this.state.settings)
    }

    getAfterSelectionAction = ():Function => {
        const afterSelection = this.afterSelection[this.state.settings.afterSelection]

        return afterSelection.action
    }

    render() {
        const showSettings = this.state.showSettings
        const afterSelection = this.state.afterSelection

        return (
            <div className="main" style={{backgroundColor: this.state.settings.backgroundColor,
                                          color: this.state.settings.fontColor}}>
                <div className="header">
                    <ToggleButton label="Settings"
                                  secondaryLabel="Go Back"
                                  showSettings={showSettings}
                                  handleStateChange={this.handleStateChange}/>
                </div>
                {showSettings
                    ? <Settings settings={this.state.settings}
                                searchRef={this.searchRef}
                                afterSelection={this.afterSelection}
                                applySettings={this.applySettings}
                                handleStateChange={this.handleStateChange} />
                    : <Search settings={this.state.settings}
                              searchValue={this.state.searchValue}
                              searchRef={this.searchRef}
                              getAfterSelectionAction={this.getAfterSelectionAction}
                              handleStateChange={this.handleStateChange} />}
            </div>
        )
    }
}


ReactDOM.render(<Main />, document.body)
serviceWorker.register()
