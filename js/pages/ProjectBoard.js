import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';
import { Panel, ListGroup, Button, Glyphicon, Popover, OverlayTrigger, Form, FieldGroup, FormGroup, ControlLabel, FormControl, Modal, Col } from 'react-bootstrap';

import Ticket from "../components/Ticket.js";

export default class Board extends React.Component {
    constructor(props) {
        super();

        // Sets the initial state
        this.state = {
            tickets : {},
            loading : true,
            currentProjectID : 0,
        };

        // Page's tickets will be filled by firebase subscription
        this.tickets = {};
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
            points: ticket.points
        };

        this.setState( {tickets : this.tickets} );

        this.setState({
           showModal: false,
           newTicketTitle: 'Add title',
           newTicketDescription: 'Add Description',
           newTicketAssignee: 'Add Assignee',
           newTicketPoints: 1,
           newTicketStatus: 'Backlog'
          });
    }

    createTicket = (title,desc,status,assignee,points) => {
        var key = firebase.createTicket(this.state.newTicketTitle,this.state.newTicketDescription,this.state.newTicketStatus,this.state.newTicketAssignee,this.state.newTicketPoints);
        this.setState({
           showModal: false,
           newTicketTitle: 'Add title',
           newTicketDescription: 'Add Description',
           newTicketAssignee: 'Add Assignee',
           newTicketPoints: 1,
           newTicketStatus: 'Backlog'
          });
    }

     close = () => {
       this.setState({ showModal: false });
     }

     open = () => {
       this.setState({ showModal: true });
     }

    render() {

        var TicketComponents = [];
        var states = [];
        var print = [];

        //figure out the lost of states
        for (var key in this.state.tickets) {
            var st = this.state.tickets[key].state;
            if (states.indexOf(st) == -1) {
                states.push(st);
            }
        }
      //loop over states and tickets, pushing the markup onto ticket components
      for(var i in states){
        var status = states[i];
        var temp = [];
        for (var key in this.state.tickets) {
          if(this.state.tickets[key].state == status){
            temp.push(
                <Ticket
                    id="inner-panel"
                    key={key}
                    ticketRef={'projects/' + this.props.params.projectID + '/tickets/' + key}
                    ticket={this.state.tickets[key]}
                />
            );
          }
        }
        TicketComponents.push(temp);
      }

      for (var j in TicketComponents){
        print.push(<h4><Panel id="state-board" class="no-padding" header={states[j]}><ListGroup>{TicketComponents[j]}</ListGroup></Panel></h4>);
      }
      var stateSelect = [];
      for(var k in states){
        stateSelect.push(<option value={states[k]}>{states[k]}</option>);
      }

        return (
            <div>
            <Form inline class="add-padding">
              <FormControl
                type="text"
                label="New Board"
                placeholder="Enter a board name"
                onChange={(e) => this.setState({newBoard: e.target.value})}
              />
              <Button class=
              "add-ticket" onClick={() => this.createTicket(this.state.newBoard)}>Create Board</Button>
              <Button
                bsStyle="info"
                onClick={this.open}
              ><Glyphicon glyph="plus"/> Create Ticket</Button>
            </Form>
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
                  <FormControl   onChange={(e) => this.setState({newTicketStatus: e.target.value})} componentClass="select">
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
