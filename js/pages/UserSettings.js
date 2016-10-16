import firebase from 'firebase'
import React from 'react';
import { Link } from "react-router";

import { Panel } from "react-bootstrap";

export default class AppConfiguration extends React.Component {

    constructor() {
        super();
        this.state = {
            authenticated: false
        };
        this.authPassword = '';
        this.newPassword = '';
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
        var statusMessage;
        if (!this.state.authenticated) {
            statusMessage = 'Authentication required';
        } else {
            statusMessage = 'Authentication sucessful';
        }
        return (
            <Panel>
                <h1>Settings</h1>
                <Panel>
                    <div>
                        {statusMessage} 
                        <input 
                            type="password"
                            onChange={(e) => this.authPassword = e.target.value}
                        />
                        <button onClick={() => this.authenticateUser()}>Authenticate Account</button>

                    </div>
                    <div>
                        New Password:
                        <input 
                            type="password"
                            onChange={(e) => this.newPassword = e.target.value}
                        />
                        <button disabled={!this.state.authenticated} onClick={() => this.resetPassword()}>Reset Password</button>
                    </div>
                    <div>
                        <button disabled={!this.state.authenticated} onClick={() => this.deleteUser()}>Delete User</button>
                    </div>
                </Panel>
            </Panel>
        );
    }

}
