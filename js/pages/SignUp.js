import React from 'react';
import { Link } from "react-router";

import { Grid, Row, Col, Panel, Button, FormControl } from "react-bootstrap";

export default class SignUp extends React.Component {
    // Signs the user up and sends them an email verification if successful.
    signUp = () => {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            // Send them an email veritication.
            user.sendEmailVerification();
            // Add them to the database
            firebase.addCurrentUser('Jo Doe', this.state.username);
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
                            onChange={(e) => this.setState({username: e.target.value})}
                            label="Username" 
                            placeholder="Username"
                        />
                        <FormControl 
                            type="text"
                            onChange={(e) => this.setState({email: e.target.value})}
                            label="Email" 
                            placeholder="Email"
                        />
                        <FormControl 
                            type="password"
                            onChange={(e) => this.setState({password: e.target.value})} 
                            placeholder="Password"
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
