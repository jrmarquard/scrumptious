import React from 'react';
import { Link } from "react-router";

import NavSite from "../components/NavSite.js"
import firebase from "firebase"

import Auth from '../components/Auth.js';

export default class Interface extends React.Component {

    constructor() {
        super();
        this.state = {
            loggedin : false
        };
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
            this.setState({ loggedin : true });
        } else {
            this.setState({ loggedin : false });
        }
    }

    render() {
        if (this.state.loggedin) {
            return (
                <div>
                    <NavSite />
                    <div id='content'>
                        {this.props.children}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <NavSite />
                    <h1>Welcome to Scrumptious</h1>
                    <p>Please sign in, or sign up if you haven't already</p>
                    <Auth />
                </div>
            );
        }
    }

}
