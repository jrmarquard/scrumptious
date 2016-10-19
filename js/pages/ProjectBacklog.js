import firebase from 'firebase';
import React from 'react';
import { Link } from "react-router";
import { Grid, Col, Row, Panel, PanelGroup, ListGroup, ListGroupItem, FormGroup, FormControl, ControlLabel, Button, Modal, Form, Glyphicon} from "react-bootstrap";

import BacklogTicketItem from "../components/BacklogTicketItem.js"

export default class ProjectBacklog extends React.Component { 

    constructor() {
        super();

        // Store tickets in state 
        this.state = {
            tickets : {},
            ticketsCompleted: [],
            ticketsBacklog: [],
            ticketsNextSprint: [],
            showModal: false,
            newTicketTitle: 'Add title',
            newTicketDescription: 'Add Description',
            newTicketAssignee: 'Add Assignee',
            newTicketPoints: 1,
            newTicketStatus: 'to_do'
        }

        this._didTicketsUpdate = false;
        // Flag to make sure state is not modified after unmounting
        this._isMounted = false;
    }

    componentWillMount = () => {
        // Get projectID from the url
        this.projectID = this.props.params.projectID;

        // Firebase reference to project stories
        this.ticketsRef = firebase.database().ref('projects/'+this.projectID+'/tickets');
    }

    componentDidMount = () => {

        // Start listening to events from the project's' stories reference
        this.ticketsRef.on('child_added', data => this.handleTickets('child_added', data.key, data.val()));
        this.ticketsRef.on('child_changed', data => this.handleTickets('child_changed', data.key, data.val()));
        this.ticketsRef.on('child_removed', data => this.handleTickets('child_removed', data.key, data.val()));

        // Set isMounted flag to true
        this._isMounted = true;
    }

    componentWillUnmount() {
        // Set isMounted flag to false
        this._isMounted = false;

        // Stop listening to events from from the project's stories reference
        this.ticketsRef.off();
    }

    handleTickets = (event, ticketID, ticket) => {
        var ticketsCopy = this.state.tickets

        // Add, change, or remove 
        if (event === 'child_added' || event === 'child_changed') {
            ticketsCopy[ticketID] = ticket;    
        } else if (event === 'child_removed') {
            delete ticketsCopy[ticketID];
        }

        this._didTicketsUpdate = true;
        // If the page is still mounted set a new state
        if (this._isMounted) this.setState({tickets:ticketsCopy});    
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

    closeNewTicketModal = () => {
        this.setState({ showModal: false });
    }

    openNewTicketModal = () => {
        this.setState({ showModal: true });
    }

    componentDidUpdate() {

        if (this._didTicketsUpdate) {
            var ticketsBacklog = [];
            var ticketsNextSprint = []

            var ticketsCompleted = [];

            for (var id in this.state.tickets) {
                var t = this.state.tickets[id];

                var ticket = ( 
                    <BacklogTicketItem
                        key={id}
                        ticketID={id}
                        projectID={this.projectID}
                        ticketTitle={t.title}
                        ticketSprint={t.sprint}
                        ticketDescription={t.description}
                        />
                );

                if (t.sprint === 'backlog') {
                    ticketsBacklog.push(ticket);
                } else if (t.sprint === 'current') {
                    // Don't display these
                } else if (t.sprint === 'next') {
                    ticketsNextSprint.push(ticket);    
                } else if (t.sprint === 'completed') {
                    ticketsCompleted.push(ticket);
                }
            }

            this._didTicketsUpdate = false;
            if(this._isMounted) this.setState({
                ticketsBacklog : ticketsBacklog,
                ticketsNextSprint : ticketsNextSprint,
                ticketsCompleted : ticketsCompleted
            });
        }
    }

    render() {

        var ticketsBacklogPanel = '';
        var ticketsNextSprintPanel = '';
        var ticketsCompletedPanel = '';

        if (this.state.ticketsBacklog.length !== 0) {
            ticketsBacklogPanel = (
                <Panel>
                    <ListGroup fill>
                        {this.state.ticketsBacklog}
                    </ListGroup>
                </Panel>
            );
        }
        if (this.state.ticketsNextSprint.length !== 0) {
            ticketsNextSprintPanel = (
                <Panel>
                    <ListGroup fill>
                        {this.state.ticketsNextSprint}
                    </ListGroup>
                </Panel> 
            );
        }
        
        if (this.state.ticketsCompleted.length !== 0) {
            ticketsCompletedPanel = (
                <Panel>
                    <ListGroup fill>
                        {this.state.ticketsCompleted}
                    </ListGroup>
                </Panel> 
            );
        }

        var states = ['to_do', 'in_progress', 'code_review', 'done'];
        var stateSelect = [];
        for(var k in states){
            stateSelect.push(<option key={k} value={states[k]}>{states[k]}</option>);
        }

        return (
            <div>
                <Grid>
                    <Row>
                        <Col xs={4}>
                            <h1>Backlog
                            
                                <Button onClick={() => this.openNewTicketModal()}>
                                    Add Ticket
                                </Button>
                            </h1>
                        </Col>
                        <Col xs={4}>
                            <h1>Next Sprint</h1>
                        </Col>
                        <Col xs={4}>
                            <h1>Completed</h1>
                        </Col>
                    </Row>
                    {/* Display backlog here */}
                    <Row>
                        <Col xs={4}>
                            {ticketsBacklogPanel}
                        </Col>
                        <Col xs={4}>
                            {ticketsNextSprintPanel}
                        </Col>
                        <Col xs={4}>
                            {ticketsCompletedPanel}
                        </Col>
                    </Row>
                </Grid>
                <Modal show={this.state.showModal} onHide={() => this.closeNewTicketModal()}>
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
                    <Button onClick={this.closeNewTicketModal}>Close</Button>
                    <Button class="add-ticket" onClick={() => this.createTicket()}><Glyphicon glyph="plus"/> Create Ticket</Button>
                  </Modal.Footer>
              </Modal>
          </div>
        );
    }

}
