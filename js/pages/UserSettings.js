import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';
export default class AppConfiguration extends React.Component {


    resetPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .catch((error) => {
            console.log('ERROR: ' + error.code + ': ' + error.message);
        });
    };

    render() {
        return (
            <div>
                <h1>Settings</h1>
                <button onClick={() => this.resetPassword()}>Send password reset email</button>
            </div>
        );
    }

}
