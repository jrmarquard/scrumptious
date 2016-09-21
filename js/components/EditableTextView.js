import React from 'react';
import firebase from 'firebase';

export default class EditableTextView extends React.Component {
    constructor(props) {
        super();
        this.state = {
            inEditMode: false,
        };
    }

    updateTicket = (data) => {
        const ticket = data.val();
        this.setState({value: ticket[this.props.field]});
    }

    componentWillMount() {
        firebase.database().ref("tickets/"+this.props.ticketKey).on('value', this.updateTicket);
    }

    componentWillUnmount() {
        firebase.database().ref("tickets/"+this.props.ticketKey).off('value', this.updateTicket);
    }

    componentDidUpdate() {
        if (this.refs.valueInput) {
            this.refs.valueInput.focus();
        }
        var data = {};
        data[this.props.field] = this.state.value;
        firebase.updateTicket(this.props.ticketKey, data);
    }

    stopEditing() {
        this.setState({inEditMode: false});
    }

    render() {
        // const {ticketKey,title,description,state,priority} = this.state;
        if (this.state.inEditMode) {
            return(
                <input ref="valueInput" type="text" value={this.state.value}
                    onChange={(e) => {
                        this.setState({value: e.target.value});
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
