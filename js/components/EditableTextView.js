import React from 'react';
import firebase from 'firebase';

export default class EditableTextView extends React.Component {
    constructor(props) {
        super();

        this.ticketField = props.field;
        this.ticketKey = props.ticketKey;

        this.state = {
            editing : false,
            value : props.value,
        }
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.editing) {
            this.refs.valueInput.focus();
            this.refs.valueInput.select();
        }

        var data = {};
        data[this.ticketField] = this.state.value;
        firebase.updateTicket(this.ticketKey, data);
    }

    startEditing = () => {
        this.setState({editing:true});
    }

    stopEditing = () => {
        this.setState({editing:false});
    }

    render() {
        if (this.state.editing) {
            return (
                <input
                    type = "text"
                    ref = "valueInput"
                    onChange={(e) => {
                        this.setState( {value : e.target.value} );
                    }}
                    onBlur={() => {
                        this.stopEditing();
                    }}
                    onKeyPress={(e) => {
                        if (e.keyCode || e.which == 13) this.stopEditing();
                    }}
                    defaultValue={this.state.value}
                    autofocus
                />
            );
        } else {
            return (
                <h3 onDoubleClick={() => this.startEditing()}>{this.state.value}</h3>
            );
        }
    }

}
