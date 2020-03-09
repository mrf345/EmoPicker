import React from 'react'
import SelectSearch from 'react-select-search'
import emojis from 'emojibase-data/en/data.json' 
import copy from 'copy-to-clipboard'

import { CommonProps } from '../index'


interface SearchProps extends CommonProps {
    searchValue:string
}


interface SearchState {
    searchValue:string
}


interface searchObj {
    name:string
    value:string
    index?:number
}


export default class Search extends React.Component<SearchProps, SearchState> {
    options:searchObj[] = emojis.map(obj => ({name: `${obj.emoji} ${obj.annotation}`,
                                              value: obj.emoji}))

    constructor(props:SearchProps) {
        super(props)
        this.state = {searchValue: this.props.searchValue}
    }

    componentDidMount() {
        this.props.searchRef.current.instanceRef.search.current.focus()
    }

    handleSelect = (obj:searchObj, state:any) => {
        if (obj) {
            const action = this.props.getAfterSelectionAction

            copy(obj.value)
            this.props.handleStateChange('searchValue', obj.name)
            action && action()()
        }
    }

    render() {
        return (
            <div className="search">
                <SelectSearch placeholder='Type to search for an emoji ...'
                              ref={this.props.searchRef}
                              options={this.options}
                              value={this.state.searchValue}
                              onChange={this.handleSelect}
                              autoFocus />
            </div>
        )
    }
}
