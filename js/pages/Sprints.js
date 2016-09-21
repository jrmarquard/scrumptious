import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';

import Ticket from "../components/Ticket.js";

export default class Sprints extends React.Component {
    constructor() {
        super();
        this.state = {
            ticket : {},
        }
        this.ticket = {};
    }

    componentWillMount() {
        firebase.tickets.once("value").then((snapshot) => {
            var keySnapshot = snapshot.child("-KS4s4ETBTmvz3JmqQ4R");
            console.log(keySnapshot, keySnapshot.val());
            this.setState( {ticket :  keySnapshot.val() } );;

        });
    }

    componentWillUnmount() {

    }

    loadTicket = (data) => {

    }

    render() {
        const { params } = this.props;

        return (
            <div>
                <h1>Sprints</h1>
                <h3>{params.sprint}</h3>
                <Ticket key={params.sprint} {...this.state.ticket} />


            </div>
        );
    }
}
