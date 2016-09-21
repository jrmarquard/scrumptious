import React from 'react';
import firebase from 'firebase';

export default class Auth extends React.Component {

    constructor() {
        super();


        // State
        this.state = {
            statusMessage: "Default",
            email: "",
            password: "",
        };
    }
    componentDidMount () {
        // Set observer on the Auth object
        this.authUnsub = firebase.auth().onAuthStateChanged(this.authObserver);
    }


    componentWillUnmount () {
        this.authUnsub();
    }

    authObserver = (user) => {
        if (user) {
            if (!user.emailVerified) {
                user.sendEmailVerification();
            }
            this.setState({statusMessage: "signed in"});
        } else {
            this.setState({statusMessage: "not signed in"});
        }
    };

    signUp = () => {
        // Sign in with email and pass.
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(function(user) {
            console.log('successfully created user');
        })
        .catch(function(error) {
            // TODO: signup error handling
            console.log('Signup Fail: ' + error.code + ': ' + error.message);
        });
    };

    signIn = () => {
        // Sign in with email and pass.
        console.log(this.state.email + ' ' + this.state.password);
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(function() {
            // TODO: login handling
            console.log('logged in successfully');
        })
        .catch(function(error) {
            // TODO: login error handling
            console.log('Login Fail: ' + error.code + ': ' + error.message);
        });
        return false;
    };

    resetPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .then(function() {
            console.log('Password reset');
        })
        .catch(function(error) {
            // TODO: signup error handling
            console.log('Password reset fail: ' + error.code + ': ' + error.message);
        });
    };

    // Signs the current user out
    signOut = () => {
        console.log('signing out');
        firebase.auth().signOut();
    };

    render() {
        const hideButton = {display: "none"};

        return (
            <div id="message">
                <h1>Sign In</h1>
                <p id="status">{this.state.statusMessage}</p>
                <form onKeyPress={(e) => {
                    if (e.keyCode || e.which == 13) this.signIn();
                }} >
                    <input type="text" onChange={(e) => {
                        this.setState({email: e.target.value})
                    }} placeholder="Email"/>
                    <input type="password" onChange={(e) => {
                        this.setState({password: e.target.value})
                    }} placeholder="Password"/>
                </form>
                <button onClick={this.signIn}>Sign In</button>
                <button onClick={this.signUp}>Sign Up</button>
                <button onClick={this.signOut}>Sign Out</button>
                <button onClick={this.resetPassword}>Reset Password</button>
            </div>
        );
    }

}
