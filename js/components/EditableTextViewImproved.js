import React from 'react';
import firebase from 'firebase';

/*
 *  Text field that can be edited on double click, and when
 *  the value changes
 *
 */
export default class EditableTextViewImproved extends React.Component {
    static propTypes = {
        value: React.PropTypes.any.isRequired,
        onChange: React.PropTypes.func.isRequired,
    }

    constructor(props) {
        super();
        this.props = props;

        this.state = {
            editing : false
        }
        this.selectOnChange = true;
    }

    componentDidUpdate() {
        if (this.state.waitingToEdit) {
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
                <div onDoubleClick={() => this.startEditing()}>{this.props.value}</div>
            );
        }
    }

}

//EditableTextViewImproved.
