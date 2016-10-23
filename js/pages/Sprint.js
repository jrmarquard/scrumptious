import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';
import { Panel, ListGroup, Button, Glyphicon, Popover, OverlayTrigger, Form, FieldGroup, FormGroup, ControlLabel, FormControl, Modal, Grid, Row, Col } from 'react-bootstrap';

import Ticket from "../components/Ticket.js";
import Status from "../components/Status.js";

export default class Sprint extends React.Component {
    constructor(props) {
        super();

        // Sets the initial state
        this.state = {
            tickets : {},
            loading : true,
            hasActiveSprint: false,
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
        // Page's statuses will be filled by firebase subscription
        this.statuses = {};
    }

    // When component is rendered to the DOM for the first time, and first time only
    componentWillMount() {
        this.unsubscribe = [];
        this.unsubscribe.push(firebase.getTicketsBySprint(this.props.params.projectID, 'current', (tickets) => {
            this.tickets = tickets;
            this.setState({ tickets: this.tickets });
        }));
        this.unsubscribe.push(firebase.hasActiveSprint(this.props.params.projectID, (hasActiveSprint) => {
            this.setState({ hasActiveSprint: hasActiveSprint });
        }));


        // firebase reference for the project's statuses
        this.projectStatuses = firebase.database().ref('projects/'+this.props.params.projectID+'/statuses/');

        // listener for the child_added event
        this.projectStatuses.on('child_added', (data) => this.displayStatuses(data.key, data.val()));

        // Wathces for removal of statuses
        this.projectStatuses.on('child_removed', (data) => this.removeStatus(data.key, data.val()));

        // Watches for updates of statuses
        this.projectStatuses.on('child_changed', (data) => this.displayStatuses(data.key, data.val()));

    }

    componentWillUnmount() {
        this.unsubscribe.forEach((unsub) => unsub());
    }

    removeStatus = (skey, payload) => {
      //work out first to give old tickets (generally backloggy)
        var first;
        for (var k in this.state.statuses) {
            if (this.state.statuses[k].order == 1) {
                first = this.state.statuses[k].key;
                break;
            }
        }
        //allocate tickets
        for (var key in this.state.tickets) {
            if (this.state.tickets[key].status == skey) {
                firebase.updateTicket(key, { status: first });
            }
        }
        //renumber other elements, that is reduce 1 of any further elements
        var num = payload.order;
        for (var j in this.state.statuses) {
            if (this.state.statuses[j].order > num) {
                var temp = this.state.statuses[j].order - 1;
                firebase.updateStatus(this.state.statuses[j].key, { order: temp });
            }
        }

      delete this.statuses[skey];
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

    createStatus = (status) => {
        if (status) {
            var max = 1;
            var completeKey;
            for (var key in this.state.statuses) {
                if (this.state.statuses[key].order > max) {
                    max = this.state.statuses[key].order;
                }
                if (this.state.statuses[key].complete == true) {
                    completeKey = this.state.statuses[key].key;
                }
            }
            firebase.updateStatus(completeKey, { order: max + 1 })
            firebase.createStatus(status, max, false);
        }
    }

    sprintAction = () => {
        if (this.state.hasActiveSprint) {
            firebase.completeSprint(this.props.params.projectID);
        } else {
            firebase.startSprint(this.props.params.projectID);
        }
    }

    render() {

        var TicketComponents = [];
        var states = [];
        var print = [];

        //order statuses
        for (var x in this.state.statuses) {
            states[this.state.statuses[x].order - 1] = this.state.statuses[x];
        }

        //add statuses to a select box friendly format
        var stateSelect = [];
        for (var k in states) {
            stateSelect.push(
                <option
                    key={k} 
                    value={states[k].key}
                    >
                    {states[k].status}
                </option>
            );
        }


        //loop over states and tickets, pushing the markup onto ticket components
        for (var i in states) {
            var status = states[i];
            var temp = [];
            for (var key in this.state.tickets) {
                if (this.state.tickets[key].status == status.key) {
                    temp.push(
                        <Ticket
                            id="inner-panel"
                            key={key}
                            tkey={key}
                            ticketRef={'projects/' + this.props.params.projectID + '/tickets/' + key}
                            ticket={this.state.tickets[key]}
                            states={states}
                            currState={status.status}
                            />
                    );
                }
            }
            TicketComponents.push(temp);
        }

        //add tickets to status boards
        for (var j in TicketComponents) {
            if (states[j]) {
                print.push(
                    <Status
                        key={j}
                        status={states[j]}
                        statusRef={'projects/' + this.props.params.projectID + '/statuses/' + states[j].key}
                        TicketComponents={TicketComponents[j]}
                        />
                );
            }
        }

        var buttonText = this.state.hasActiveSprint ? 'Complete Sprint' : 'Start Next Sprint';

        return (
            <div>
                <Grid>
                    <Row>
                        <Form inline class="add-padding">
                            <FormControl
                                type="text"
                                label="New Board"
                                placeholder="New board name"
                                onChange={(e) => this.setState({ newBoard: e.target.value })}
                                />
                            <Button class="add-ticket" onClick={() => this.createStatus(this.state.newBoard)}>
                                <Glyphicon glyph="plus" /> Create Board
                            </Button>
                            <Button class="add-ticket marg-left success" onClick={() => this.sprintAction()}>
                                <Glyphicon glyph="ok" /> {buttonText}
                            </Button>
                        </Form>
                    </Row>
                    <Row id="tickets">
                        <div class="horizontal-scroll">
                            {print}
                        </div>
                    </Row>
                </Grid>
            </div>
        );
    }
}
