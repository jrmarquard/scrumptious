import React from 'react';
import { Link } from "react-router";
import { Button, Nav, Navbar, NavDropdown, MenuItem, NavItem,FormGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class NavProject extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Navbar class="navbar-custom">
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to={'/project/' + this.props.projectID + '/'}>
                            {this.props.projectTitle}
                        </Link>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav id='nav-project'>
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
                </Nav>
            </Navbar>
        );
    }
}
