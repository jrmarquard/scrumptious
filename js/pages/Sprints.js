import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';

import Ticket from "../components/Ticket.js";

export default class Sprints extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    loadTicket = (data) => {

    }

    render() {
        return (
            <div>
                <h1>Sprints</h1>
                <h3>{this.props.params.sprint}</h3>
            </div>
        );
    }
}
