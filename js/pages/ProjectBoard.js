import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';
import { Panel, ListGroup, Button, Glyphicon, Popover, OverlayTrigger, Form, FieldGroup, FormGroup, ControlLabel, FormControl, Modal, Col } from 'react-bootstrap';

import Ticket from "../components/Ticket.js";

import Status from "../components/Status.js";

export default class Board extends React.Component {
    constructor(props) {
        super();

        // Sets the initial state
        this.state = {
            tickets : {},
            loading : true,
            currentProjectID : 0,
            showModal: false,
             newTicketTitle: 'Add title',
             newTicketDescription: 'Add Description',
             newTicketAssignee: 'Add Assignee',
             newTicketPoints: 1,
             newTicketStatus: 'none'
        };

        // Page's tickets will be filled by firebase subscription
        this.tickets = {};

        // Page's statuses will be filled by firebase subscription
        this.statuses = {};


    }

    // When component is rendered to the DOM for the first time, and first time only
    componentWillMount() {
        // firebase reference for the project's tickets
        this.projectTickets = firebase.database().ref('projects/'+this.props.params.projectID+'/tickets/');

        // listener for the child_added event
        this.projectTickets.on('child_added', (data) => this.displayTicket(data.key, data.val()));

        // Wathces for removal of tickets
        this.projectTickets.on('child_removed', (data) => this.removeTicket(data.key, data.val()));

        // Watches for updates of tickets
        this.projectTickets.on('child_changed', (data) => this.displayTicket(data.key, data.val()));

        // firebase reference for the project's tickets
        this.projectStatuses = firebase.database().ref('projects/'+this.props.params.projectID+'/statuses/');

        // listener for the child_added event
        this.projectStatuses.on('child_added', (data) => this.displayStatuses(data.key, data.val()));

        // Wathces for removal of tickets
        this.projectStatuses.on('child_removed', (data) => this.removeStatus(data.key, data.val()));

        // Watches for updates of tickets
        this.projectStatuses.on('child_changed', (data) => this.displayStatuses(data.key, data.val()));
    }

    componentWillUnmount() {
        this.projectTickets.off();
    }

    removeTicket = (key, payload) => {
        delete this.tickets[key];
        this.setState( {tickets : this.tickets } );
    }

    displayTicket = (key, ticket) => {

        // Push the ticket onto the state object
        this.tickets[key] = {
            key: key,
            title: ticket.title,
            description: ticket.description,
            assignee: ticket.assignee,
            state: ticket.status,
            points: ticket.points,
        };

        this.setState( {tickets : this.tickets} );

    }

    removeStatus = (key, payload) => {
      //work out first to give old tickets (generally backloggy)
      var first;
      for( var k in this.state.statuses){
        if(this.state.statuses[k].order == 1){
         first = this.state.statuses[k].key;
         break;
        }
      }
      //allocate tickets
      for(var i in this.state.tickets){
        if(this.state.tickets[i].state == key){
          firebase.updateTicket(this.state.tickets[i].key,{status:first});
        }
      }
      //renumber other elements, that is reduce 1 of any further elements
      var num = payload.order;
      for( var j in this.state.statuses){
        if(this.state.statuses[j].order > num){
          var temp = this.state.statuses[j].order - 1;
          firebase.updateStatus(this.state.statuses[j].key,{order:temp});
        }
      }

      delete this.statuses[key];
      this.setState( {statuses : this.statuses } );
    }

    displayStatuses= (key, status) => {

        // Push the ticket onto the state object
        this.statuses[key] = {
            key: key,
            status: status.status,
            order: status.order
        };

        this.setState( {statuses : this.statuses} );

    }

    createTicket = () => {
        if(this.state.newTicketStatus != 'none'){
        var key = firebase.createTicket(this.state.newTicketTitle,this.state.newTicketDescription,this.state.newTicketStatus,this.state.newTicketAssignee,this.state.newTicketPoints);
        this.setState({
           showModal: false,
           newTicketTitle: 'Add title',
           newTicketDescription: 'Add Description',
           newTicketAssignee: 'Add Assignee',
           newTicketPoints: 1,
           newTicketStatus: 'none'
          });
        }
    }

    createStatus = (status) => {
      var max = 0;
        for( var key in this.state.statuses){
          if(this.state.statuses[key].order > max){
            max = this.state.statuses[key].order;
          }
        }
        max = max + 1;
        firebase.createStatus(status,max);
    }

     close = () => {
       this.setState({ showModal: false });
     }

     open = () => {
       var first;
       for( var key in this.state.statuses){
         if(this.state.statuses[key].order == 1){
          first = this.state.statuses[key].key;
          break;
         }
      }
       this.setState({ showModal: true, newTicketStatus: first});

     }

    render() {

      var TicketComponents = [];
      var states = [];
      var print = [];

      //order statuses
      for (var x in this.state.statuses){
        states[this.state.statuses[x].order-1] = this.state.statuses[x];
      }

      //add statuses to a select box friendly format
      var stateSelect = [];
      for(var k in states){
        stateSelect.push(<option value={states[k].key}>{states[k].status}</option>);
      }

      //loop over states and tickets, pushing the markup onto ticket components
      for(var i in states){
        var status = states[i];
        var temp = [];
        for (var key in this.state.tickets) {
          if(this.state.tickets[key].state == status.key){
            temp.push(
                <Ticket
                    id="inner-panel"
                    key={key}
                    ticketRef={'projects/' + this.props.params.projectID + '/tickets/' + key}
                    ticket={this.state.tickets[key]}
                    states = {states}
                    currState = {status.status}
                />
            );
          }
        }
        TicketComponents.push(temp);
      }

      //add tickets to status boards
      for (var j in TicketComponents){
        if(states[j]){
        print.push(
          <Status
            status={states[j]}
            statusRef={'projects/' + this.props.params.projectID + '/statuses/' + states[j].key}
            TicketComponents={TicketComponents[j]}
          />
        );
        }
      }

        return (
            <div>
            <div class="add-form">
              <Form inline class="add-padding">
                <FormControl
                  type="text"
                  label="New Board"
                  placeholder="Enter a board name"
                  onChange={(e) => this.setState({newBoard: e.target.value})}
                />
                <Button class=
                "add-ticket" onClick={() => this.createStatus(this.state.newBoard)}>Create Board</Button>
                <Button
                  bsStyle="info"
                  class="marg-left"
                  onClick={this.open}
                ><Glyphicon glyph="plus"/> Create Ticket</Button>
              </Form>
            </div>
            <div id="tickets">{print}</div>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form horizontal>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>
                    Title
                  </Col>
                  <Col sm={10}>
                    <FormControl onChange={(e) => this.setState({newTicketTitle: e.target.value})} type="text" placeholder="Title of ticket" />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>
                    Assignee
                  </Col>
                  <Col sm={10}>
                    <FormControl onChange={(e) => this.setState({newTicketAssignee: e.target.value})} type="text" placeholder="Assign a ticket to a person" />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>
                    Description
                  </Col>
                  <Col sm={10}>
                    <FormControl onChange={(e) => this.setState({newTicketDescription: e.target.value})} type="text" componentClass="textarea" placeholder="Enter a short description" />
                  </Col>
                </FormGroup>
                <FormGroup controlId="formControlsSelect">
                  <Col componentClass={ControlLabel} sm={2}>
                    Select a board
                  </Col>
                  <Col sm={10}>
                    <FormControl onChange={(e) => this.setState({newTicketStatus: e.target.value})} componentClass="select">
                      {stateSelect}
                    </FormControl>
                  </Col>
                </FormGroup>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
              <Button class="add-ticket" onClick={() => this.createTicket()}><Glyphicon glyph="plus"/> Create Ticket</Button>
            </Modal.Footer>
          </Modal>

            </div>
        );
    }
}
