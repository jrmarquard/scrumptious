import firebase from 'firebase';
import React from 'react';

import { Panel, ListGroup, Form, ListGroupItem, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import UserListGroupItem from './UserListGroupItem.js';

export default class ProjectSettingsUsers extends React.Component {
    // Required props for this Component
    static propTypes = {
        // Not really optional, marked this way to suppress warnings
        // when cloning the component using React.cloneElement
        projectID: React.PropTypes.string,
    }

    constructor() {
        super();
        this.state = {
            usersObj : {},
            addUserUsername : '',
            addUserRole : 'developer',
            validUsername : false,
            usersListDevelopers : [],
            usersListCustomers : [], 
            usersListRequests : [], 
            usersListInvites : []
        }

        // To hold users before rendering to state 
        this.users = {};

        // To save queried user's userID
        this.addUserUserID = null;

        this._isMounted = false;
        this._didUsersUpdate = false;
    }

    componentDidMount() {
    	this.usersRef = firebase.database().ref('projects/'+this.props.projectID+'/users');

        
        this.usersRef.on('child_added', (data) => this.handleUsers('child_added', data.key, data.val()));
        this.usersRef.on('child_changed', (data) => this.handleUsers('child_changed', data.key, data.val()));
        this.usersRef.on('child_removed', (data) => this.handleUsers('child_removed', data.key, data.val()));

        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.usersRef.off();
    }

    componentDidUpdate(prevProps, prevState) {
        // If the addUserUsername field has changed
        if (prevState.addUserUsername !== this.state.addUserUsername) {
            // If the field is an empty string, don't search
            if (this.state.addUserUsername === '') return;
            firebase.database().ref('usernames/'+this.state.addUserUsername)
            .once('value')
            .then((data) => {
                // If the data found is valid
                if (data.val() !== null) {
                    if (!this.state.validUsername) {
                        this.addUserUserID = data.val();
                        this.setState({validUsername : true});
                    }
                } else {
                    if (this.state.validUsername) {
                        this.addUserUserID = data.val();
                        this.setState({validUsername : false});
                    }
                }
            })
            .catch((error) => console.log(error));
        }

        // If usersObj has been updated
        if (this._didUsersUpdate) {
            var usersListDevelopers = [];
            var usersListCustomers = [];
            var usersListRequests = [];
            var usersListInvites = [];
            for (var id in this.state.usersObj) {
                var u = this.state.usersObj[id];
                var userListItem = (
                    <UserListGroupItem
                        key={id}
                        userID={id}
                        projectID={this.props.projectID}
                        username={u.username}
                        role={u.role}
                        status={u.status}
                        />
                );
                if (u.status === 'requested') {
                    usersListRequests.push(userListItem);
                } else if (u.status === 'invited') {
                    usersListInvites.push(userListItem)
                } else if (u.status === 'accepted') {
                    if (u.role === 'customer') {
                        usersListCustomers.push(userListItem);
                    } else if (u.role === 'owner' || u.role === 'developer') {
                        usersListDevelopers.push(userListItem);
                    }
                } else {
                    console.log('User ' + this.props.userID + 'in project ' + this.props.projectID + ' has incorrect status');
                }
            }

            this._didUsersUpdate = false;
            if (this._isMounted) this.setState({
                usersListDevelopers : usersListDevelopers,
                usersListCustomers : usersListCustomers, 
                usersListRequests : usersListRequests, 
                usersListInvites : usersListInvites 
            });
        }     
    }

    handleUsers = (event, userID, user) => {

        // Get the username of the of 
        firebase.database().ref('users/'+userID+'/username').once('value')
        .then((data) => {
            // Set the username in the user object
            user.username = data.val();

            // Make a copy of the usersObj from state
            var usersObjCopy = this.state.usersObj;

            // Add/remove user to copied usersObj
            if (event === 'child_added' || event === 'child_changed') {
                usersObjCopy[userID] = user;
            } else if (event === 'child_removed') {
                delete usersObjCopy[userID];
            }


            this._didUsersUpdate = true;
            
            // Set the state with the copied
            this.setState({usersObj:usersObjCopy});
        });
    }

    
    // If flag is set, validate username
    getUsernameValidation = () => {
        if (this.state.validUsername) return 'success';
        if (this.state.addUserUsername.length > 0) return 'error';
    }

    addUser = () => {
        // Exit if the username is not valid
        if (!this.state.validUsername) return;

        // Shouldn't need this, but keeping it for peace of mind
        // Exit if addUserUserID is set to null
        if (this.addUserUserID === null) return;

        // Add as developer into project
        firebase.database().ref('projects/'+ this.props.projectID +'/users/' + this.addUserUserID)
        .set({
            role : this.state.addUserRole,
            status : 'invited',
        });

        // Send invite to user
        firebase.database().ref('notifications').push({
            to: this.addUserUserID,
            from: this.props.projectID,
            type: 'project-invite',
            content: this.props.projectID,
            status: 'unread',
        });

        this.setState({validUsername:false});
        this.setState({addUserUsername:''});
    }

    render() {
        return (
            <div>
                <Panel header={'Developers [' + this.state.usersListDevelopers.length + ']'}>
                    <ListGroup fill>
                        {this.state.usersListDevelopers}
                    </ListGroup>
                </Panel>

                <Panel header={'Customers [' + this.state.usersListCustomers.length + ']'}>
                    <ListGroup fill>
                        {this.state.usersListCustomers}
                    </ListGroup>
                </Panel>

                <Panel header={'Requests [' + this.state.usersListRequests.length + ']'}>
                    <ListGroup fill>
                        {this.state.usersListRequests}
                    </ListGroup>
                </Panel>

                <Panel header={'Invites [' + this.state.usersListInvites.length + ']'}>
                    <ListGroup fill>
                        {this.state.usersListInvites}
                    </ListGroup>
                </Panel>

                {/* Add user to project panel */}
                <Panel>
                    <FormGroup controlId="formControlsTextarea" validationState={this.getUsernameValidation()}>
                        <ControlLabel>Add User</ControlLabel>
                        <FormControl 
                            type="text"
                            placeholder="Enter username"
                            value={this.state.addUserUsername}
                            onChange={(e) => {
                                this._invalidateSearch = true;
                                this.setState({addUserUsername : e.target.value});
                            }}
                            onKeyPress={(e) => {if (e.keyCode || e.which == 13) this.addUser()}}
                            />
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                        <FormControl
                            onChange={(e) => {
                                this.setState({addUserRole:e.target.value})
                            }} 
                            defaultValue={this.state.addUserRole} 
                            componentClass="select"
                            >
                            <option value="developer">Developer</option>
                            <option value="customer">Customer</option>
                        </FormControl>
                    </FormGroup>
                    <Button
                        bsStyle="success"
                        disabled={!this.state.validUsername}
                        onClick={() => this.addUser()}>
                        Add User
                    </Button>
                </Panel>
            </div>
        );
    }
}
