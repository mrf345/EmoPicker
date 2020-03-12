import React from 'react'
import { RouterProps } from 'react-router'
import SelectSearch from 'react-select-search'
import copy from 'copy-to-clipboard'
import emojis from 'emojibase-data/en/data.json'

import { CommonProps } from '../index'


interface searchObj {
    name:string
    value:string
    index?:number
}


interface SearchProps extends CommonProps, RouterProps {}

export default class Search extends React.Component<SearchProps> {
    static options = emojis.map(obj => ({name: `${obj.emoji} ${obj.annotation}`,
                                         value: obj.emoji}))

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
                              options={Search.options}
                              onChange={this.handleSelect}
                              autoFocus />
            </div>
        )
    }
}
