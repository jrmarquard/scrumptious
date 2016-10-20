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
            statuses: {},
            ticketsBacklog: [],
            ticketsNextSprint: [],
            showModal: false,
            newTicketTitle: 'Add title',
            newTicketDescription: 'Add Description',
            newTicketAssignee: 'Add Assignee',
            newTicketPoints: 1,
            newTicketStatus: 'none'
        }

        this._didTicketsUpdate = false;
        // Flag to make sure state is not modified after unmounting
        this._isMounted = false;
        // Page's statuses will be filled by firebase subscription
        this.statuses = {};
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

        // firebase reference for the project's statuses
        this.projectStatuses = firebase.database().ref('projects/'+this.props.params.projectID+'/statuses/');

        // listener for the child_added event
        this.projectStatuses.on('child_added', (data) => this.displayStatuses(data.key, data.val()));

        // Watches for updates of statuses
        this.projectStatuses.on('child_changed', (data) => this.displayStatuses(data.key, data.val()));
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
           newTicketStatus: 'none'
          });
    }
    

    displayStatuses= (key, status) => {
      // Push the ticket onto the state object
      this.statuses[key] = {
          key: key,
          complete: status.complete,
          status: status.status,
          order: status.order
      };

      this.setState( {statuses : this.statuses} );

    }

    closeNewTicketModal = () => {
        this.setState({ showModal: false });
    }

    openNewTicketModal = () => {
      var first;
      for( var key in this.state.statuses){
        if(this.state.statuses[key].order == 1){
         first = this.state.statuses[key].key;
         break;
        }
      }
      this.setState({ showModal: true, newTicketStatus: first });
    }

    componentDidUpdate() {

        if (this._didTicketsUpdate) {
            var ticketsBacklog = [];
            var ticketsNextSprint = []

            for (var id in this.state.tickets) {
                var t = this.state.tickets[id];

                var ticket = (
                    <BacklogTicketItem
                        key={id}
                        ticketID={id}
                        projectID={this.projectID}
                        ticketTitle={t.title}
                        ticketSprint={t.sprint}
                        />
                );

                if (t.sprint === 'backlog') {
                    ticketsBacklog.push(ticket);
                } else if (t.sprint === 'current') {
                    // Don't display these
                } else if (t.sprint === 'next') {
                    ticketsNextSprint.push(ticket);
                }
            }

            this._didTicketsUpdate = false;
            if(this._isMounted) this.setState({
                ticketsBacklog : ticketsBacklog,
                ticketsNextSprint : ticketsNextSprint
            });
        }
    }

    render() {

        var ticketsBacklogPanel = '';
        var ticketsNextSprintPanel = '';

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

        var states = [];

        //order statuses
        for (var x in this.state.statuses){
          states[this.state.statuses[x].order-1] = this.state.statuses[x];
        }

        //add statuses to a select box friendly format
        var stateSelect = [];
        for(var k in states){
          stateSelect.push(<option value={states[k].key}>{states[k].status}</option>);
        }

        return (
            <div>
                <Grid>
                    <Row>
                        <Col xs={6}>
                            <h1>Backlog</h1>
                            <Button onClick={() => this.openNewTicketModal()}>
                                Add Ticket
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <h1>Next Sprint</h1>
                        </Col>
                    </Row>
                    {/* Display backlog here */}
                    <Row>
                        <Col xs={6}>
                            {ticketsBacklogPanel}
                        </Col>
                        <Col xs={6}>
                            {ticketsNextSprintPanel}
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
