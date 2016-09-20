import React from 'react';
import { Link } from "react-router";

import Nav from "../components/Nav.js"

export default class Interface extends React.Component {
    render() {
        return (
            <div>
                <Nav />
                {this.props.children}
            </div>
        );
    }

}
