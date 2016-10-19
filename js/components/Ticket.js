import React from 'react';
import firebase from 'firebase';
import EditableTextView from './EditableTextView.js';
import { Button, Panel, ListGroup, ListGroupItem, Glyphicon, Label, Popover, OverlayTrigger} from 'react-bootstrap';




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
      const pop = (
        <Popover class="popover-ticket" id="popover-trigger-click-root-close">
            Title: <br/> <strong><EditableTextView
                value={this.props.ticket.title}
                onChange={(data) => this.updateField('title', data)}
            /></strong><br/>
            Assignee:<br/><strong><EditableTextView
                value={this.props.ticket.assignee}
                onChange={(data) => this.updateField('assignee', data)}
            /></strong><br/>
            Description: <br/> <strong><EditableTextView
                value={this.props.ticket.description}
                onChange={(data) => this.updateField('description', data)}
            /></strong><br/>
            Points: <br/> <strong><EditableTextView
                value={this.props.ticket.points}
                onChange={(data) => this.updateField('points', data)}
            /></strong><br/>

          <Button class="deleteTicket" onClick={() => this.deleteTicket()}><Glyphicon glyph="trash"/></Button>
        </Popover>
      );


        return(
          <OverlayTrigger trigger="click" rootClose placement="right" overlay={pop}>
          <Button  id={this.props.ticket.id}  class="ticket-box">
                <h4 class="light-text">{this.props.ticket.title} <Label bsStyle="info" class="rightalign">{this.props.ticket.points}</Label></h4>
                <h5><Label bsStyle="default">{this.props.ticket.assignee}</Label></h5>
          </Button>
          </OverlayTrigger>
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
