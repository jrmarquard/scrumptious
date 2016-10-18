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

    render() {
        return (
            <div>
                <h1>Sprints</h1>
            </div>
        );
    }
}
