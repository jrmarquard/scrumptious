import firebase from 'firebase'
import React from 'react';
import { Link } from "react-router";

import { Panel } from "react-bootstrap";

import Notification from './Notification.js';

export default class Notifications extends React.Component {

    constructor() {
        super();

        this._isMounted = false;

        this.notifications = {};
        this.state = {
            rNotifications:[],
        }
    }

	componentDidMount() { 
        this._isMounted = true;

        // Set reference to firebase root in case it unmounts too quickly
        this.userNotificationsRef = firebase.database().ref('/');

        // When the auth state changes, subscribte to firebase references
        this.authUnsub = firebase.auth().onAuthStateChanged((user) => {  
            this.userNotificationsRef = firebase.database().ref('users/'+user.uid+'/notifications');

            this.userNotificationsRef.on('child_added', (data) => this.handleNotifications('child_added', data.key, data.val()));
            this.userNotificationsRef.on('child_changed', (data) => this.handleNotifications('child_changed', data.key, data.val()));
            this.userNotificationsRef.on('child_removed', (data) => this.handleNotifications('child_removed', data.key, data.val()));
        });
	}

	componentWillUnmount() {
        this._isMounted = false;
        this.userNotificationsRef.off();
	}

    handleNotifications = (event, nofificationID, notification) => {
        // Add or remove notification from component tracking
        if (event === 'child_added' || event === 'child_changed') {
            this.notifications[nofificationID] = notification;    
        } else if (event === 'child_removed') {
            delete this.notifications[nofificationID];
        }

        // Render notifications out
        var newNotifications = [];
        for (var id in this.notifications) {
            var n = this.notifications[id];

            newNotifications.push(
                <Notification key={id} id={id} type={n.type} content={n.content} read={n.read} />
            )
        }

        if (this._isMounted) this.setState({rNotifications: newNotifications});
    }

    render() {
        return (
            <Panel header='Notifications'>
                {this.state.rNotifications}
            </Panel>
        );
    }

}
