import firebase from 'firebase'
import React from 'react';
import { Link } from "react-router";

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
        this.userNotificationsRef = firebase.database().ref('users/'+firebase.getCurrentUser().uid+'/notifications');

		this.userNotificationsRef.on('child_added', (data) => this.handleNotifications('added', data.key, data.val()));
        this.userNotificationsRef.on('child_removed', (data) => this.handleNotifications('removed', data.key, data.val()));
        this.userNotificationsRef.on('child_changed', (data) => this.handleNotifications('changed', data.key, data.val()));
	}

	componentWillUnmount() {
        this._isMounted = false;
        this.userNotificationsRef.off();
	}

    handleNotifications = (event, nofificationID, notification) => {
        if (event === 'added' || event === 'changed') {
            this.notifications[nofificationID] = notification;    
        } else if (event === 'removed') {
            delete this.notifications[nofificationID];
        }

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
            <div id='notificiations'>
                {this.state.rNotifications}
            </div>
        );
    }

}
