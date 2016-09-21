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
                <EditableTextView value={title} field="title" ticketKey={key} />
                <EditableTextView value={state} field="state" ticketKey={key} />
                <EditableTextView value={priority} field="priority" ticketKey={key} />
                <EditableTextView value={description} field="description" ticketKey={key} />
                <button onClick={this.deleteTicket}>Delete</button>
            </div>
        );
    }

}
