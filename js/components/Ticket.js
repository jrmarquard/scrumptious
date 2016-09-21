import React from 'react';
import firebase from 'firebase';
import EditableTextView from './EditableTextView.js';

export default class Ticket extends React.Component {
    deleteTicket = () => {
        firebase.deleteTicket(this.props.ticket.key);
    }

    render() {
        const {key,title,description,state,priority} = this.props.ticket;
        return(
            <div class="ticket" id={key}>
                <EditableTextView field="title" ticketKey={key} />
                <EditableTextView field="state" ticketKey={key} />
                <EditableTextView field="priority" ticketKey={key} />
                <EditableTextView field="description" ticketKey={key} />
                <button onClick={this.deleteTicket}>Delete</button>
            </div>
        );
    }

}
