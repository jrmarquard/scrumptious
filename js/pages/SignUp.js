import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';
import { Grid, Row, Col, Panel, Button, FormControl } from "react-bootstrap";

export default class SignUp extends React.Component {
    // Signs the user up and sends them an email verification if successful.
    signUp = () => {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            // Add userid into users
            var username = 'user' + Date.now();
            firebase.database().ref('users/' + user.uid).set({
                name: '',
                username: username,
            })
            // Add user to usernames/
            firebase.database().ref('usernames/' + username).set(user.uid);
        })
        .catch((error) => console.log(error));
    };
    
    render() {
        return (
            <Grid>
            <Row>
            <Col
                xs={8} xsOffset={2}
                sm={6} smOffset={3}
                md={4} mdOffset={4}
                lg={2} lgOffset={5}
            >
                <Panel header='Sign Up'>
                    <form
                        id="sign-in"
                        onKeyPress={(e) => {
                            if (e.keyCode || e.which == 13) this.signUp()
                        }} >
                        <FormControl
                            type="text"
                            placeholder="Email"
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                        <FormControl
                            type="password"
                            placeholder="Password"
                            onChange={(e) => this.setState({password: e.target.value})} 
                        />
                        <Button
                            onClick={this.signUp}>
                            Sign Up
                        </Button>
                    </form>
                </Panel>
            </Col>
            </Row>
            </Grid>
        );
    }
}
