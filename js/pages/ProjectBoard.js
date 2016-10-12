import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';

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
            state: ticket.state,
            priority: ticket.priority
        };

        this.setState( {tickets : this.tickets} );
    }

    createTicket = () => {
        firebase.createTicket('test', 'desc', 'low', 'todo');
    }

    render() {
        var TicketComponents = [];
        // loop over all the key/values
        for (var key in this.state.tickets) {
            // push oonto TIcketComponents
            TicketComponents.push(
                <Ticket 
                    key={key}
                    ticketRef={'projects/' + this.props.params.projectID + '/tickets/' + key}
                    ticket={this.state.tickets[key]} 
                />
            );
        }

        return (
            <div>
                <h1>Board: {this.props.params.projectID}</h1>
                <button onClick={() => this.createTicket()}>Create</button>
                <div id="tickets">{TicketComponents}</div>
            </div>
        );
    }
}
