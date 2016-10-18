import React from 'react';

/*
 *  Text field that can be edited on double click, and when
 *  the value changes it calls the function provided in props.onChange
 */
export default class EditableTextView extends React.Component {
    // Required props for this Component
    static propTypes = {
        value: React.PropTypes.any.isRequired,
        onChange: React.PropTypes.func.isRequired,
    }

    constructor() {
        super();

        this.state = {
            editing : false
        }
        this.selectOnChange = true;
    }

    componentDidUpdate() {
        if (this.state.editing) {
            this.refs.valueInput.focus();
            if (this.selectOnChange) {
                this.refs.valueInput.select();
                this.selectOnChange = false;
            }
        }
    }

    startEditing = () => {
        this.setState( { editing : true } );
    }

    stopEditing = () => {
        this.selectOnChange = true;
        this.setState({editing:false});
    }

    render() {
        if (this.state.editing) {
            return (
                <input
                    type = "text"
                    ref = "valueInput"
                    onChange={(e) => {
                        this.props.onChange( e.target.value );
                    }}
                    onBlur={() => {
                        this.stopEditing();
                    }}
                    onKeyPress={(e) => {
                        if (e.keyCode || e.which == 13) this.stopEditing();
                    }}
                    defaultValue={this.props.value}
                />
            );
        } else {
            return (
                <span onDoubleClick={() => this.startEditing()}>{this.props.value}</span>
            );
        }
    }
}