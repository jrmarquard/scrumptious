import React from 'react';
import firebase from 'firebase';
import Notifications from "../components/Notifications.js"
import Projects from "../components/Projects.js"
import { Link } from "react-router";

import { Grid, Row, Col, Panel, Button, FormControl } from "react-bootstrap";

export default class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            componentContent : <div>Page loading, please wait</div>
        }
    }

    componentWillMount() {
        this.onAuthChangeUnsub = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    componentContent :
                        <div>
                            <Notifications />
                            <Projects />
                        </div>
                });
            } else {
                this.setState({
                    componentContent :
                        <Panel header="You're not currently logged in!">
                            <p>Welcome to Scrumptious</p>
                            <p>Please <Link to='/signin'>Sign In</Link> or <Link to='/signup'>Sign Up</Link> to continue</p>
                        </Panel>
                });
            }
        });
    }

    componentWillUnmount() {
        this.onAuthChangeUnsub();
    }

    render() {
        return this.state.componentContent;
    }
}
