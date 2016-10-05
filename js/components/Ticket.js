import React from 'react';
import firebase from 'firebase';
import EditableTextView from './EditableTextView.js';
import { Button, Panel } from 'react-bootstrap';

export default class Ticket extends React.Component {
    constructor(props) {
        super();
    }

    deleteTicket = () => {
        firebase.deleteTicket(this.props.ticket.key);
    }

    updateField = (field, value) => {
        firebase.database().ref(this.props.ticketRef).child(field)
        .set(value)
        .catch(() => console.log('Failed to change ' + field + ' to ' + value + '.'));
    }

    render() {
        return(
            <div class="ticket" id={this.props.ticket.key}>
                <EditableTextView
                    value={this.props.ticket.title}
                    onChange={(data) => this.updateField('title', data)}
                />
                <EditableTextView
                    value={this.props.ticket.state}
                    onChange={(data) => this.updateField('state', data)}
                />
                <EditableTextView
                    value={this.props.ticket.priority}
                    onChange={(data) => this.updateField('priority', data)}
                />
                <EditableTextView
                    value={this.props.ticket.description}
                    onChange={(data) => this.updateField('description', data)}
                />
                <button onClick={() => this.deleteTicket()}>Delete</button>
            </div>
        );
    }

}
