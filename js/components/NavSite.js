import React from 'react';
import { Link } from "react-router";

import Auth from './Auth.js';

export default class Nav extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return (
            <nav id='nav-site'>
                <Link to="/"><div>Home</div></Link>
                <Link to="/projects"><div>Projects</div></Link>
                <Link to="/about"><div>About</div></Link>
                <Link to="/user"><div>User</div></Link>
                <Auth />
            </nav>
        );
    }
}
