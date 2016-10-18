import firebase from 'firebase'
import React from 'react';

import { Link } from "react-router";

export default class Notification extends React.Component {
    // Required props for this Component
    static propTypes = {
        id: React.PropTypes.any.isRequired,
        from: React.PropTypes.any.isRequired,
        to: React.PropTypes.any.isRequired,
        type: React.PropTypes.any.isRequired,
        content: React.PropTypes.any.isRequired,
        status: React.PropTypes.any.isRequired,
    }

    deleteNotification = () => {
        firebase.database().ref('notifications/'+this.props.id).remove();
    }

    acceptProjectInvite = () => {
        var projectID = this.props.content;
        var notifID = this.props.id;
        var userID = firebase.getCurrentUser().uid;

        // Change notification
        firebase.database().ref('notifications/'+notifID).update({
            type: 'project-invite',
            status: 'read'
        });

        // Get reference to user in project
        var projectUserRef = firebase.database().ref('projects/'+projectID+'/users/'+userID);

        // Change status in project
        projectUserRef.child('status').set('accepted').then(() => {
            // Add project reference to user
            projectUserRef.once('value').then((data) => {
                firebase.database().ref('users/'+userID+'/projects/'+projectID).update(data.val());
            });
        }).then(() => {
            this.deleteNotification();
        });
    }

    render() {
        var notificiationRender;

        var type = this.props.type;
        var content = this.props.content;

        if (type === 'message') {
            notificiationRender = (
                <div class='notification'>
                    [{type}]: {content}
                    <button onClick={() => this.deleteNotification()}>Delete</button>
                </div>
            );
        } else if (type === 'project-invite') {
            notificiationRender = (
                <div class='notification'>
                    [{type}]: {content}
                    <button onClick={() => this.acceptProjectInvite()}>Accept</button>
                    <button onClick={() => this.deleteNotification()}>Delete</button>
                </div>
            );
        }

        return notificiationRender;
    }

}
