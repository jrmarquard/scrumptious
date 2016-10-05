import React from 'react';
import { Link } from "react-router";
import { Button, Nav, Navbar, NavDropdown, MenuItem, NavItem,FormGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Auth from './Auth.js';

export default class NNav extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return (
            <Navbar>
             <Navbar.Header>
               <Navbar.Brand>
                 <a href="#">Scrumptious</a>
               </Navbar.Brand>
             </Navbar.Header>
             <Nav id='nav-site'>
                 <LinkContainer to="/home">
                  <NavItem eventKey={1}>Home</NavItem>
                 </LinkContainer>
                 <LinkContainer to="/projects">
                  <NavItem eventKey={2}>Projects</NavItem>
                 </LinkContainer>
                 <LinkContainer to="/about">
                   <NavItem eventKey={3}>About</NavItem>
                 </LinkContainer>
                 <LinkContainer to="/user">
                  <NavItem eventKey={4}>User</NavItem>
                 </LinkContainer>
             </Nav>
             <Navbar.Form pullRight>
             <Button bsStyle="default" class="marg-left" onClick={Auth.signOut}>Sign Out</Button>
             <Button bsStyle="default" class="marg-left" onClick={Auth.resetPassword}>Reset Password</Button>
            </Navbar.Form>
           </Navbar>


        );
    }
}
