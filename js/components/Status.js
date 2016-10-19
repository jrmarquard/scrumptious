import React from 'react';
import firebase from 'firebase';
import EditableTextView from './EditableTextView.js';
import { Button, Panel, ListGroup, ListGroupItem, Glyphicon, FormControl, Label, Popover, OverlayTrigger, ButtonGroup, ButtonToolbar} from 'react-bootstrap';




export default class Status extends React.Component {
    constructor(props) {
        super();

    }

    removeStatus = () => {
        firebase.deleteStatus(this.props.status.key);
    }

    updateField = (field, value) => {
        firebase.database().ref(this.props.statusRef).child(field)
        .set(value)
        .catch(() => console.log('Failed to change ' + field + ' to ' + value + '.'));
    }




    render() {
      const pop = (
        <Popover class="popover-ticket" id="popover-trigger-click-root-close">
            Status name: <br/> <strong>
            <EditableTextView
                value={this.props.status.status}
                onChange={(data) => this.updateField('status', data)}
            /></strong><br/>
          <Button onClick={() => this.removeStatus(this.props.status.key)}>Remove Status <Glyphicon glyph="trash"/></Button>
        </Popover>
      );

        return(
          <h4><Panel id="state-board" class="no-padding" header={this.props.status.status}>
          <OverlayTrigger trigger="click" rootClose placement="right" overlay={pop}>
          <Button class="editStatus"><Glyphicon glyph="edit"/></Button>
          </OverlayTrigger>
          <ListGroup>{this.props.TicketComponents}</ListGroup></Panel></h4>
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
<FormControl  onChange={(e) => this.updateField('status',e.target.value)} componentClass="select" placeholder={this.props.ticket.currState}>
  {this.props.stateSelect}
</FormControl>
*/
