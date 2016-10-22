import React from 'react';
import firebase from 'firebase';
import EditableTextView from './EditableTextView.js';
import { Button, Panel, ListGroup, ListGroupItem, Glyphicon, FormControl, Label, Popover, OverlayTrigger, ButtonGroup, ButtonToolbar} from 'react-bootstrap';

export default class Ticket extends React.Component {
    constructor(props) {
        super();

    }

    deleteTicket = () => {
        firebase.deleteTicket(this.props.tkey);
    }

    updateField = (field, value) => {
        firebase.database().ref(this.props.ticketRef).child(field)
        .set(value)
        .catch(() => console.log('Failed to change ' + field + ' to ' + value + '.'));
    }

    render() {

      var stateSelect = [];
      for(var k in this.props.states){
        if(this.props.states[k].key == this.props.ticket.status){
          stateSelect.push(<option value={this.props.states[k].key}>{this.props.states[k].status}</option>);
        break;
        }
      }
      for(var k in this.props.states){
        if(this.props.states[k].key != this.props.ticket.status){
          stateSelect.push(<option value={this.props.states[k].key}>{this.props.states[k].status}</option>);
        }
      }

      const pop = (
        <Popover class="popover-ticket" id="popover-trigger-click-root-close">
            <strong>Title:</strong> <br/> <EditableTextView
                value={this.props.ticket.title}
                onChange={(data) => this.updateField('title', data)}
            /><br/>
            <strong>Assignee:</strong><br/><EditableTextView
                value={this.props.ticket.assignee}
                onChange={(data) => this.updateField('assignee', data)}
            /><br/>
            <strong>Description:</strong> <br/><EditableTextView
                value={this.props.ticket.description}
                onChange={(data) => this.updateField('description', data)}
            /><br/>
            <strong>Points: </strong> <br/><EditableTextView
                value={this.props.ticket.points}
                onChange={(data) => this.updateField('points', data)}
            /><br/>
            <strong>Current Status:</strong> <br/>
            <FormControl  onChange={(e) => this.updateField('status',e.target.value)} componentClass="select">
              {stateSelect}
            </FormControl>
            <br/>
          <Button class="deleteTicket" onClick={() => this.deleteTicket()}><Glyphicon glyph="trash"/></Button>
        </Popover>
      );


        return(
          <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={pop}>
          <Button  id={this.props.ticket.id}  class="ticket-box">
                <h4 class="light-text">{this.props.ticket.title} <Label bsStyle="info" class="rightalign">{this.props.ticket.points}</Label></h4>
                <h5><Label bsStyle="default">{this.props.ticket.assignee}</Label></h5>
          </Button>
          </OverlayTrigger>
        );
    }

}
