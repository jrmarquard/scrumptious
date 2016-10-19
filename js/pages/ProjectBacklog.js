import firebase from 'firebase';
import React from 'react';
import { Link } from "react-router";

import { Grid, Col, Row, Panel, PanelGroup, ListGroup, ListGroupItem, FormGroup, FormControl, ControlLabel, Button} from "react-bootstrap";

import BacklogTicketItem from "../components/BacklogTicketItem.js"

export default class ProjectBacklog extends React.Component { 

    constructor() {
        super();

        // Store tickets in state 
        this.state = {
            tickets : {},
            ticketsBacklog: [],
            ticketsNextSprint: []
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

        return (
            <Grid>
                <Row>
                    <Col xs={6}>
                        <h1>Backlog</h1>
                        <Button onClick={() => this.addTicket}>
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
        );
    }

}
