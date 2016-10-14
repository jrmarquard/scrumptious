import React from 'react';
import firebase from 'firebase';
import EditableTextView from './EditableTextView.js';
import { Button, Panel, ListGroup, ListGroupItem, Glyphicon, Label} from 'react-bootstrap';

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
            <ListGroupItem id={this.props.ticket.key}>
                <h4 class="light-text">{this.props.ticket.title} <Label bsStyle="info" class="rightalign">{this.props.ticket.points}</Label></h4>
                <h5>Assignee: <Label bsStyle="default">{this.props.ticket.assignee}</Label></h5>
                <Button onClick={() => this.deleteTicket()}><Glyphicon glyph="trash"/></Button>
                <Button><Glyphicon glyph="edit"/></Button>
            </ListGroupItem>
        );
    }

}


/*
<EditableTextView
    value={this.props.ticket.title}
    onChange={(data) => this.updateField('title', data)}
/>
<br/>
<EditableTextView
    value={this.props.ticket.state}
    onChange={(data) => this.updateField('state', data)}
/>
<br/>
<EditableTextView
    value={this.props.ticket.assignee}
    onChange={(data) => this.updateField('assignee', data)}
/>
<br/>
<EditableTextView
    value={this.props.ticket.description}
    onChange={(data) => this.updateField('description', data)}
/>
<br/>
<EditableTextView
    value={this.props.ticket.points}
    onChange={(data) => this.updateField('points', data)}
/>
<br/>
*/
