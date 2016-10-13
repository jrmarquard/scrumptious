import firebase from "firebase"

import React from 'react';
import { Link, hashHistory } from "react-router";

import NavSite from "../components/NavSite.js"

export default class Interface extends React.Component {
    componentWillMount() {
        this.redirectRoute = '/';
        this.redirect = false;
        this.loggedIn = false;

        this.state = {
            isProjectActive : false
        }
    }

    componentDidMount() {
        // Subscribte to auth state listener and save unsubscribte callback
        this.authUnsub = firebase.auth().onAuthStateChanged(this.authObserver);
    }

    componentWillUnmount() {
        // Unsubsubcribe from auth state listener
        this.authUnsub();
    }

    // Runs after the component has received an update but before render is run.
    // If this returns false, render will be skipped this cycle.
    shouldComponentUpdate(nextProps) {
        // If user is not logged in, redirect them to the sign in page and save their redirect
        if (this.loggedIn === false) {
            this.redirect = true;
            var path = nextProps.children.props.location.pathname;
            switch (path) {
                case '/' : 
                case '/signin' :
                case '/signup' :
                case '/404' :
                    // If it is any of these pages, render as normal
                    return true;
                default:
                    // Save the redirect path
                    this.redirectRoute = path;
                    // If it is something else, redirect to sign in
                    hashHistory.push('/signin');
                    // Skip this render
                    return false;
            }
        } else {

            // When the user is logged in, render as normal
            return true;
        }
    }

    authObserver = (user) => {
        if (user) {
            this.loggedIn = true;
            
            // If the redirect is set, send the user to that page.
            // The redirect will be set if they requested a valid page while signed out
            if (this.redirect) {
                hashHistory.push(this.redirectRoute);    
                this.redirect = false;
            }
        } else {
            this.loggedIn = false;

            // Redirect the user to the home page when they sign out. 
            hashHistory.push('/');
        }
    }

    render() {
        
        var path = this.props.children.props.location.pathname.split('/');
        var isProjectActive = false;
        if (path[1] === 'project') {
            firebase.setCurrentProject(path[2]);
            isProjectActive = true;
        } else {
            firebase.setCurrentProject(0);
            isProjectActive = false;
        }

        return (
            <div>
                <NavSite isProjectActive={isProjectActive} projectID={path[2]}/>
                <div id='content'>
                    {this.props.children}
                </div>
            </div>
        );
    }

}
