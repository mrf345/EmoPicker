import React from 'react'


interface ButtonProps {
    label:string
    style?:string
    onClick(e:any):any
}


export default class ActionButton extends React.Component<ButtonProps> {
    constructor(props:ButtonProps) {
        super(props)
    }


    render() {
        return (
            <button className={this.props.style || ''} onClick={this.props.onClick}>
                {this.props.label}
            </button>
        )
    }
}
