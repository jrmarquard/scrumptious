import React from 'react';
import { Link } from "react-router";

import Nav from "../components/Nav.js"
import firebase from "firebase"

export default class Interface extends React.Component {

    constructor() {
        super();
        this.state = {
            loading : true,
            loggedin : false };
    }

    componentWillMount() {
        // Subscribte to auth state listener and save unsubscribte callback
        this.authUnsub = firebase.auth().onAuthStateChanged(this.authObserver);
    }

    componentWillUnmount() {
        // Unsubsubcribe from auth state listener
        this.authUnsub();
    }

    authObserver = (user) => {
        if (user) {
            this.setState({loggedin : true });
        } else {
            this.setState({loggedin : false });
        }
        this.setState({loading : false});
    }

    render() {
        if (this.state.loggedin) {
            return (
                <div>
                    <Nav loggedin={this.state.loggedin}/>
                    {this.props.children}
                </div>
            );
        } else if (this.state.loading) {
            return (
                <div>
                    <h1>Loading</h1>
                </div>
            )
        } else {
            return (
                <div>
                    <Nav />
                    <h1>Welcome to Scrumptious</h1>
                    <p>Please sign in, or sign up if you haven't already</p>
                </div>
            );
        }
    }

}
