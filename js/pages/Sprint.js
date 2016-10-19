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
        this.unsubscribe = firebase.getTicketsBySprint(this.props.params.projectID, 'current', (tickets) => {
            this.tickets = tickets;
            this.setState({ tickets: this.tickets });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    completeSprint = () => {
        firebase.completeSprint(this.props.params.projectID);
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
        print.push(<Col key={j} xs={3}><h4><Panel id="state-board" class="no-padding" header={header}><ListGroup>{TicketComponents[j]}</ListGroup></Panel></h4></Col>);
      }

        return (
            <div>
                <Grid>
                  <Row>
                    <Form inline class="add-padding">
                      <Button class=
                      "add-ticket" onClick={() => this.completeSprint()}>Complete Sprint</Button>
                    </Form>
                  </Row>
                  <Row id="tickets">{print}</Row>
                </Grid>
            </div>
        );
    }
}
