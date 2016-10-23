import firebase from 'firebase';
import React from 'react';

import { Grid, Row, Col, Panel, Button, ListGroupItem } from 'react-bootstrap';

export default class BacklogTicketItem extends React.Component {
    // Required props for this Component
    static propTypes = {
        ticketID: React.PropTypes.any.isRequired,
        projectID: React.PropTypes.any.isRequired,
        ticketTitle: React.PropTypes.any.isRequired,
        ticketSprint: React.PropTypes.any.isRequired,
        ticketDescription: React.PropTypes.any.isRequired
    }

    constructor(props) {
        super();
        this.ticketRef = firebase.database().ref('projects/'+props.projectID+'/tickets/'+props.ticketID);
    }

    moveToNextSprint = () => {
        this.ticketRef.update({sprint:'next'});
    }

    moveToBacklog = () => {
        this.ticketRef.update({sprint:'backlog'});
    }

    deleteTicket = () => {
        this.ticketRef.remove();
    }

    render() {
        var button = '';
        if (this.props.ticketSprint === 'backlog') {
            button = (
                <Button bsStyle="primary" onClick={() => this.moveToNextSprint()}>
                    Move to next sprint
                </Button>
            );
        } else if (this.props.ticketSprint === 'next') {
            button = (
                <Button bsStyle="primary" onClick={() => this.moveToBacklog()}>
                    Move to backlog
                </Button>
            );
        }
        return (
            <ListGroupItem>
                <Grid>
                    <Row>
                        <h3>{this.props.ticketTitle}</h3>
                    </Row>
                    <Row>
                        <p>{this.props.ticketDescription}</p>
                    </Row>
                    <Row>
                        {button}
                        <Button class='backlog-ticket-item-delete' bsStyle='danger' onClick={() => this.deleteTicket()}>
                            Delete Ticket
                        </Button>
                    </Row>
                </Grid>
            </ListGroupItem>
        );
    }
}
