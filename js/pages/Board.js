import React from 'react';
import { Link } from "react-router";

import Ticket from "../components/Ticket.js";

export default class Board extends React.Component {
    constructor() {
        super();
        this.state = {
            tickets: {},
        };
        this.tickets = {};
    }

    // When component is rendered to the DOM for the first time, and first time only
    componentWillMount() {
        firebase.tickets.on("child_added",  (data) => {
            this.displayTicket(data.key, data.val());
        });
        firebase.tickets.on("child_removed",  (data) => {
            this.undisplayTicket(data.key, data.val());
        });
    }

    componentWillUnmount() {
        firebase.tickets.off();
    }

    undisplayTicket = (key, payload) => {
        delete this.tickets[key];
        this.setState( {tickets : this.tickets } );
    }
    displayTicket = (key, payload) => {
        if (payload == null) return;

        // Push the ticket onto the state object
        this.tickets[key] = {
            key: key,
            title: payload.title,
            description: payload.description,
            state: payload.state,
            priority: payload.priority
        };

        this.setState( {tickets : this.tickets} );
    }

    createTicket = () => {
        const ticketPayload = {
            title: "test",
            description: "desc",
            priority: "low",
            state: "todo",
        }
        firebase.createTicket(ticketPayload);
    }

    render() {
        const TicketComponents = [];
        // loop over all the key/values
        for (var key in this.state.tickets) {
            // push oonto TIcketComponents
            TicketComponents.push(<Ticket key={key} ticket={this.state.tickets[key]} />);
        }

        return (
            <div>
                <h1>Board</h1>
                <button onClick={this.createTicket}>Create</button>
                <div id="tickets">{TicketComponents}</div>
            </div>
        );
    }
}
