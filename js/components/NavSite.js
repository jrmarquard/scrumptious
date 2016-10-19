import React from 'react';
import { Button, Nav, Navbar, NavDropdown, MenuItem, NavItem, FormGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import firebase from 'firebase';

export default class NNav extends React.Component {
    constructor() {
        super();

        this.state = {
            authNavPanel: []
        }
    }

    componentWillMount() {
        this.onAuthStateChangedUnsub = firebase.auth().onAuthStateChanged(this.onAuthChangeObserver);
    }

    componentWillUnmount() {
        this.onAuthStateChangedUnsub();
    }

    onAuthChangeObserver = (user) => {
        if (user) {
            // If logged in display a link to the user page
            this.setState({
                authNavPanel:
                    <Nav pullRight class="no-marg">
                        <NavDropdown eventKey={3} title="User Menu" id="basic-nav-dropdown">
                            <LinkContainer to={'/user/' + user.uid}>
                                <MenuItem>Your Profile</MenuItem>
                            </LinkContainer>
                            <LinkContainer to={'/settings'}>
                                <MenuItem>Your Settings</MenuItem>
                            </LinkContainer>
                            <MenuItem divider />
                            <MenuItem onSelect={() => firebase.auth().signOut()}>Sign Out</MenuItem>
                        </NavDropdown>
                    </Nav>
            });
        } else {
            // If logged out display a link to the sign up and sign in pages
            this.setState({
                authNavPanel:
                <Nav pullRight class="no-marg">
                    <LinkContainer to="/signup">
                        <NavItem eventKey={4}>Sign Up</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/signin">
                        <NavItem eventKey={4}>Sign In</NavItem>
                    </LinkContainer>
                </Nav>
            });
        }
    }

    render() {
        var projectPanel = '';
        if(this.props.isProjectActive) {
            projectPanel =
                <Nav id='nav-project'>
                    <LinkContainer to={'/project/' + this.props.projectID + '/overview'}>
                        <NavItem>Project Overview</NavItem>
                    </LinkContainer>
                    <LinkContainer to={'/project/' + this.props.projectID + '/board'}>
                        <NavItem>Scrum Board</NavItem>
                    </LinkContainer>
                    <LinkContainer to={'/project/' + this.props.projectID + '/sprints'}>
                        <NavItem>Sprints</NavItem>
                    </LinkContainer>
                    <LinkContainer to={'/project/' + this.props.projectID + '/stories'}>
                        <NavItem>Stories</NavItem>
                    </LinkContainer>
                    <LinkContainer to={'/project/' + this.props.projectID + '/settings'}>
                        <NavItem>Settings</NavItem>
                    </LinkContainer>
                </Nav>;
        }

        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#"><img width={'20px'} src="./images/icon.png" /></a>
                    </Navbar.Brand>
                </Navbar.Header>
                {projectPanel}
                {this.state.authNavPanel}
            </Navbar>
        );
    }
}
