import firebase from 'firebase';
import React from 'react';

import { Grid, Row, Col, ListGroupItem, ButtonToolbar, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class UserListGroupItem extends React.Component {
    // Required props for this Component
    static propTypes = {
        projectID: React.PropTypes.any.isRequired,
        userID: React.PropTypes.any.isRequired,
        username: React.PropTypes.any.isRequired,
        role: React.PropTypes.any.isRequired,
        status: React.PropTypes.any.isRequired
    }

    constructor(props) {
        super();
        this.userProjectRef = firebase.database().ref('users/'+props.userID+'/projects/'+props.projectID); 
        this.projectUserRef = firebase.database().ref('projects/'+props.projectID+'/users/'+props.userID); 
    }

    /**
     * Remove user by removing user entry under the project and 
     * the project entry under the user 
     */
    removeUser = () => {
    	this.userProjectRef.remove();
    	this.projectUserRef.remove();
    }

    /**
     * Cancel request by removing user entry from the project.
     * User will still have a notification in their notifications.
     */
    cancelInvite = () => {
    	this.projectUserRef.remove();
    }

    /**
     * Accept request changes the status of the user to 'accepted'
     */
    acceptRequest = () => {
    	this.projectUserRef.child('status').set('accepted');
    }

    /**
     * Decline request removes the user entry in the project 
     */
    declineRequest = () => {
    	this.projectUserRef.remove();
    }

    changeRole = (role) => {
        this.projectUserRef.child('role').set(role);
    }

    render() {
        /** Set display for role options 
         * 
         * Set role:
         * - chose between developer/customer by default
         * - if owner don't show select menu
         * 
         */
        var roleSelect = (
            <FormGroup controlId="formControlsSelect">
                <FormControl
                    onChange={(e) => this.changeRole(e.target.value)}  
                    defaultValue={this.props.role} 
                    componentClass="select">
                    <option value="developer">Developer</option>
                    <option value="customer">Customer</option>
                </FormControl>
            </FormGroup>
        );
        if (this.props.role === 'owner') {
            roleSelect = <p>Owner</p>
        }

        /** Set button toolbar depending on status
         *  
         * Status:
         * - invited: User has been invited, we can cancel their invite
         * - requested: User has requested to join, we can accept/decline their request
         * - accepted: User is part of the project. We can remove them (don't show for owner)
         */
        var buttonToolbar = ''
        if (this.props.status === 'invited') {
            buttonToolbar = (
                <ButtonToolbar>
                    <Button bsStyle='danger' onClick={() => this.cancelInvite()}>
                        Cancel
                    </Button>
                </ButtonToolbar>

            );
        } else if (this.props.status === 'requested') {
            buttonToolbar = (
                <ButtonToolbar>
                    <Button bsStyle='success' onClick={() => this.acceptRequest()}>
                        Accept
                    </Button>
                    <Button bsStyle='danger' onClick={() => this.declineRequest()}>
                        Decline
                    </Button>
                </ButtonToolbar>
            )
        } else if (this.props.role !== 'owner' && this.props.status === 'accepted') {
            buttonToolbar = (
                <ButtonToolbar>
                    <Button bsStyle='danger' onClick={() => this.removeUser()}>
                        Remove
                    </Button>
                </ButtonToolbar>
            )
        }

        return (
            <ListGroupItem>
                <Grid>
                    <Row>
                        <Col xs={4}>
                            {this.props.username}
                        </Col>
                        <Col xs={4}>
                            {roleSelect}
                        </Col>
                        <Col>
                            {buttonToolbar}
                        </Col>
                    </Row>
                </Grid>
            </ListGroupItem>
        );
    }
}
