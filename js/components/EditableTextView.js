import React from 'react';
import firebase from 'firebase';

export default class EditableTextView extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            inEditMode : false,
            value : '',
        };
    }

    updateTicket = (ticket) => {
        if (!ticket) return;
        this.setState({value: ticket[this.props.field]});
    }

    componentWillMount() {
        firebase.database().ref("tickets/"+this.props.ticketKey).on('value', (data) => this.updateTicket(data.val()));
    }

    componentWillUnmount() {
        firebase.database().ref("tickets/"+this.props.ticketKey).off('value', (data) => this.updateTicket(data.val()));
    }

    componentDidUpdate() {
        if (this.state.inEditMode) this.refs.valueInput.focus();

        var data = {};
        data[this.props.field] = this.state.value;
        firebase.updateTicket(this.props.ticketKey, data);
    }

    stopEditing() {
        this.setState({inEditMode: false});
    }

    render() {
        if (this.state.inEditMode) {
            // Focus input on the textfield
            return(
                <input ref="valueInput" type="text" value={this.state.value}
                    onChange={(e) => {
                        this.setState({value:e.target.value});
                    }}
                    onBlur={() => {
                        this.stopEditing();
                    }}
                    onKeyPress={(e) => {
                        if (e.keyCode || e.which == 13) this.stopEditing();
                    }}/>
            );
        } else {
            return(
                <h3 onClick={() => {
                    this.setState({inEditMode: true})
                }}>{this.state.value}</h3>
            );
        }
    }

}
