import firebase from 'firebase'
import React from 'react';

import { Link } from "react-router";

export default class Notification extends React.Component {
    // Required props for this Component
    static propTypes = {
        id: React.PropTypes.any.isRequired,
        type: React.PropTypes.any.isRequired,
        content: React.PropTypes.any.isRequired,
        read: React.PropTypes.any.isRequired,
    }

    deleteNotification = () => {
        var notifID = this.props.id;
        var userID = firebase.getCurrentUser().uid;

        firebase.database().ref('users/'+userID+'/notifications/'+notifID).remove();
    }

    acceptProjectInvite = () => {
        var projectID = this.props.content;
        var notifID = this.props.id;
        var userID = firebase.getCurrentUser().uid;

        // Change role in the project
        firebase.database().ref('projects/'+projectID+'/users/'+userID).set({role:'developer'});

        // Change notification
        firebase.database().ref('users/'+userID+'/notifications/'+notifID).update({
            type: 'project-invite-accepted',
            read: true
        });

        // Add project reference to user
        var projectData = {};
        projectData[projectID] = 'developer'
        firebase.database().ref('users/'+userID+'/projects').set(projectData);

    }

    render() {
        var notificiationRender;

        var id = this.props.id;
        var type = this.props.type;
        var content = this.props.content;
        var read = this.props.read;

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
        } else if (type === 'project-invite-accepted') {
            notificiationRender = (
                <div class='notification'>
                    [{type}]: {content}
                    <button onClick={() => this.deleteNotification()}>Delete</button>
                </div>
            );
        }

        return notificiationRender;
    }

}
