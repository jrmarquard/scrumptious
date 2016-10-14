import React from 'react';
import { Link, hashHistory } from "react-router";
import firebase from 'firebase';
import { Grid, Row, Col, Panel, Button, FormControl } from "react-bootstrap";

export default class SignIn extends React.Component {

    // Signs the user in
    signIn = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
            console.log('logged in successfully');
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
                <Panel header='Sign in'>
                    <form
                        id="sign-in"
                        onKeyPress={(e) => {
                            if (e.keyCode || e.which == 13) this.signIn()
                        }} >
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
                            onClick={this.signIn}>
                            Sign In
                        </Button>
                    </form>
                </Panel>
                <Panel>
                    Don't have an account? <Link  to="/signup"> Sign up now. </Link>
                </Panel>
            </Col>
            </Row>
            </Grid>
        );
    }
}
