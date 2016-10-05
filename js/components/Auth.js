import React from 'react';
import firebase from 'firebase';
import { Button } from "react-bootstrap";
import { FormControl } from "react-bootstrap";

export default class Auth extends React.Component {
    constructor() {
        super();
        this.state = {
            statusMessage: "Default",
            email: "",
            password: "",
            username: "",
            signedin: false,
        };
    }

    componentDidMount () {
        this.authUnsub = firebase.auth().onAuthStateChanged(this.authObserver);
    }

    componentWillUnmount () {
        this.authUnsub();
    }

    // Called when auth state is changed
    authObserver = (user) => {
        if (user) {
            // Only allow the user to sign in once their email is verified
            if (!user.emailVerified) {
                user.sendEmailVerification();
                console.log('Email not verified, signing out')
                this.signOut();
            } else {
                this.setState({signedin : true});
            }
        } else {
            this.setState({signedin : false});
        }
    };

    // Signs the user up and sends them an email verification if successful.
    signUp = () => {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            // Send them an email veritication.
            user.sendEmailVerification();
            // Add them to the database
            // This should be moved to once they have verified email ... etc
            firebase.addCurrentUser('Jo Doe', this.state.username);
        })
        .catch((error) => console.log(error));
    };

    // Signs the user in
    signIn = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => console.log('logged in successfully'))
        .catch((error) => console.log(error));
    };

    resetPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .catch((error) => {
            console.log('ERROR: ' + error.code + ': ' + error.message);
        });
    };

    // Signs the current user out
    signOut = () => {
        firebase.auth().signOut();
    };

    render() {
        if (this.state.signedin) {

        } else {
            return (
                <div id="authform" class="padding">
                    <form onKeyPress={(e) => {
                        if (e.keyCode || e.which == 13) this.signIn()
                    }} >
                        <FormControl type="text" class="margins" onChange={(e) => {
                            this.setState({username: e.target.value})
                        }} placeholder="Username"/>
                        <FormControl type="text" class="margins" onChange={(e) => {
                            this.setState({email: e.target.value})
                        }} placeholder="Email"/>
                        <FormControl type="password" class="margins" onChange={(e) => {
                            this.setState({password: e.target.value})
                        }} placeholder="Password"/>
                        <Button bsStyle="primary" class="marg-left" onClick={this.signIn}>Sign In</Button>
                        <Button bsStyle="default" class="marg-left" onClick={this.signUp}>Sign Up</Button>
                    </form>
                </div>
            );
        }
    }

}
