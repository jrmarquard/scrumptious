import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';
import { Panel, ListGroup, Button, Glyphicon, Popover, OverlayTrigger, Form, FieldGroup, FormGroup, ControlLabel, FormControl, Modal, Grid, Row, Col } from 'react-bootstrap';

import Ticket from "../components/Ticket.js";

export default class Sprint extends React.Component {
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
            newTicketStatus: 'to_do'
        };

        // Page's tickets will be filled by firebase subscription
        this.tickets = {};
    }

    // When component is rendered to the DOM for the first time, and first time only
    componentWillMount() {
        firebase.getTicketsBySprint(this.props.params.projectID, 'current', (tickets) => {
            this.tickets = tickets;
            this.setState({ tickets: this.tickets });
        });
    }

    componentWillUnmount() {
        this.projectTickets.off();
    }

    createTicket = (title,desc,status,assignee,points) => {
        var key = firebase.createTicket(this.state.newTicketTitle,this.state.newTicketDescription,this.state.newTicketStatus,this.state.newTicketAssignee,this.state.newTicketPoints);
        this.setState({
           showModal: false,
           newTicketTitle: 'Add title',
           newTicketDescription: 'Add Description',
           newTicketAssignee: 'Add Assignee',
           newTicketPoints: 1,
           newTicketStatus: 'to_do'
          });
    }

    completeSprint = () => {
        firebase.completeSprint(this.props.params.projectID);
    }

     close = () => {
       this.setState({ showModal: false });
     }

     open = () => {
       this.setState({ showModal: true });
     }

    render() {

        var TicketComponents = [];
        var states = ['to_do', 'in_progress', 'code_review', 'done'];
        var print = [];

      //loop over states and tickets, pushing the markup onto ticket components
      for(var i in states){
        var status = states[i];
        var temp = [];
        for (var key in this.state.tickets) {
          if(this.state.tickets[key].status == status){
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
        var header = states[j].toLowerCase().split('_').map(function(word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
        print.push(<Col xs={3}><h4><Panel id="state-board" class="no-padding" header={header}><ListGroup>{TicketComponents[j]}</ListGroup></Panel></h4></Col>);
      }
      var stateSelect = [];
      for(var k in states){
        stateSelect.push(<option value={states[k]}>{states[k]}</option>);
      }

        return (
            <div>
            <Grid>
              <Row>
                <Form inline class="add-padding">
                  <Button class=
                  "add-ticket" onClick={() => this.completeSprint()}>Complete Sprint</Button>
                  <Button
                    bsStyle="info"
                    onClick={this.open}
                  ><Glyphicon glyph="plus"/> Create Ticket</Button>
                </Form>
              </Row>
              <Row id="tickets">{print}</Row>
            </Grid>




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
