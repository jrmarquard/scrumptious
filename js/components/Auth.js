import React from 'react';
import firebase from 'firebase';

export default class Auth extends React.Component {
    constructor() {
        super();
        this.state = {
            statusMessage: "Default",
            email: "",
            password: "",
            signedin: false,
        };
    }

    componentDidMount () {
        // Set observer on the Auth object
        this.authUnsub = firebase.auth().onAuthStateChanged(this.authObserver);
    }

    componentWillUnmount () {
        this.authUnsub();
    }

    // Called when auth state is changed
    authObserver = (user) => {
        if (user) {
            if (!user.emailVerified) {
                user.sendEmailVerification();
            }
            this.setState({signedin : true});
        } else {
            this.setState({signedin : false});
        }
    };

    // Signs the user up and sends them an email verification if successful.
    signUp = () => {
        // Sign in with email and pass.
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(function(user) {
            // When creating a user for the first time, send them an email veritication.
            user.sendEmailVerification();
        })
        .catch(function(error) {
            console.log('ERROR: ' + error.code + ': ' + error.message);
        });
    };

    // Signs the user in
    signIn = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(function() {
            // TODO: login handling
            console.log('logged in successfully');
        })
        .catch(function(error) {
            // TODO: login error handling
            console.log('ERROR: ' + error.code + ': ' + error.message);
        });
        return false;
    };

    resetPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .catch((error) => {
            console.log('ERROR: ' + error.code + ': ' + error.message);
        });
    };

    // Signs the current user out
    signOut = () => {
        firebase.auth().signOut()
        .catch((e) => console.log(e));
    };

    render() {
        if (this.state.signedin) {
            return(
                <div id="authform">
                    <button onClick={this.signOut}>Sign Out</button>
                    <button onClick={this.resetPassword}>Reset Password</button>
                </div>
            );
        } else {
            return (
                <div id="authform">
                    <form onKeyPress={(e) => {
                        if (e.keyCode || e.which == 13) this.signIn()
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
                </div>
            );
        }
    }

}
