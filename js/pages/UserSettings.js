import firebase from 'firebase'
import React from 'react';
import { Link } from "react-router";

import { Panel, ListGroup, ListGroupItem } from "react-bootstrap";

import EditableTextView from '../components/EditableTextView.js';

export default class AppConfiguration extends React.Component {

    constructor() {
        super();
        this.state = {
            authenticated: false,
            name : '',
            username : ''
        };
        this.authPassword = '';
        this.newPassword = '';
        this.userID = '';
        this._isMounted = false;
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) this.userID = user.uid;
            // Definte firebase reference to the user's data
            this.userRef = firebase.database().ref('users/'+this.userID);

            // Attach a listener to all user's data
            this.userRef.on('value', this.userListener);
            this._isMounted = true;

        });
    }

    componentWillUnmount() {
        if (this._isMounted) this.userRef.off();
    }

    userListener = (data) => {
        var name = data.val().name;
        var username = data.val().username;

        this.setState({ 
            name: name,
            username: username,
        });
    }
    
    updateField = (field, value) => {
        firebase.database().ref('users/'+this.userID).child(field).set(value)
        .catch(() => console.log('Failed to change ' + field + ' to ' + value + '.'));
    }

    resetPassword = () => {
        var user = firebase.auth().currentUser;

        user.updatePassword(this.newPassword)
        .then(() => {
            console.log('password reset');
        }).catch((error) => {
            console.log(error);
        });
    };

    deleteUser = () => {
        var user = firebase.auth().currentUser;
        var userid = user.uid
        
        // Look up username of user
        firebase.database().ref('users/'+userid+'/username').once('value').then((data) => {
            // Remove user from usernames/
            firebase.database().ref('usernames/'+data.val()).remove()
            .catch((error)=> console.log(error));
        }).then(() => {
            // Remove user from users/
            firebase.database().ref('users/'+user.uid).remove()
            .catch((error)=> console.log(error));
        }).then(() => {
            // Delete from authentication
            user.delete()
            .catch((error) => console.log(error));
        });
    }

    authenticateUser = () => {
        var user = firebase.auth().currentUser;
        var credential = firebase.auth.EmailAuthProvider.credential(user.email, this.authPassword);

        // Reauthenticate user and update state
        user.reauthenticate(credential)
        .then(() => this.setState({ authenticated : true }))
        .catch((error) => console.log(error)); 
    }

    render() {
        var authenticationStatus;
        if (!this.state.authenticated) {
            authenticationStatus = 'Not authenticated';
        } else {
            authenticationStatus = 'Authentication sucessful';
        }
        return (
            <Panel>
                <h1>Settings</h1>
                <Panel>
                    <h3>Profile Settings</h3>
                    <ListGroup fill>
                        <ListGroupItem>
                            <h3>Name: </h3>
                            <EditableTextView
                                value={this.state.name}
                                onChange={(data) => this.updateField('name', data)}
                            />
                        </ListGroupItem>
                        <ListGroupItem>
                            <h3>UserName: </h3>
                            <EditableTextView
                                value={this.state.username}
                                onChange={(data) => this.updateField('username', data)}
                            />
                        </ListGroupItem>
                    </ListGroup>
                </Panel>
                <Panel>
                    <h3>Account Settings</h3>
                    <ListGroup fill>
                        <ListGroupItem>
                            <h4>Authentication [{authenticationStatus}]</h4>
                            <p>Authentication is required to change your password or delete your account.</p>
                            <input 
                                type="password"
                                onChange={(e) => this.authPassword = e.target.value}
                            />
                            <button onClick={() => this.authenticateUser()}>Authenticate Account</button>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h4>New Password</h4>
                            <input 
                                type="password"
                                onChange={(e) => this.newPassword = e.target.value}
                            />
                            <button disabled={!this.state.authenticated} onClick={() => this.resetPassword()}>Reset Password</button>
                        </ListGroupItem>
                        <ListGroupItem>
                            <button disabled={!this.state.authenticated} onClick={() => this.deleteUser()}>Delete User</button>
                        </ListGroupItem>
                    </ListGroup>
                </Panel>
            </Panel>
        );
    }

}
