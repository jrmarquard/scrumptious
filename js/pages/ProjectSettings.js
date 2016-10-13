import firebase from 'firebase';
import React from 'react';
import { hashHistory } from 'react-router';
import EditableTextView from '../components/EditableTextView.js';

export default class ProjectConfiguration extends React.Component {
	constructor() {
		super();
		this.state = {
			userAddField: '',
			projectTitle: '',
			renderedCollaborators: [],
		}
		this.collaborators = {};
        this._isMounted = false;
	}

    componentDidMount() {
        this._isMounted = true;
    	this.projectTitleRef = firebase.database().ref('projects/' + firebase.currentProjectID + '/title')
    	this.projectUsersRef = firebase.database().ref('projects/' + firebase.currentProjectID + '/users')

		this.projectTitleRef.on('value', (data) => {
            this.setState({
                projectTitle: data.val()
            });
        });
        this.projectUsersRef.on('child_added', (data) => this.handleUsersEvent('added', data.key, data.val()));
        this.projectUsersRef.on('child_changed', (data) => this.handleUsersEvent('changed', data.key, data.val()));
        this.projectUsersRef.on('child_removed', (data) => this.handleUsersEvent('removed', data.key, data.val()));
    }

    componentWillUnmount() {
        this._isMounted = false;
        firebase.database().ref('projects/' + firebase.currentProjectID + '/title').off();

    }	

    updateField = (field, value) => {
        firebase.database().ref('projects/' + firebase.currentProjectID + '/title')
        .set(value)
        .catch(() => console.log('Failed to change ' + field + ' to ' + value + '.'));
    }

    handleUsersEvent = (event, userID, userInfo) => {
    	if (event === 'added' || event === 'changed') {
	    	this.collaborators[userID] = userInfo;
    	} else if (event === 'removed') {
    		delete this.collaborators[userID];
    	}

    	// Iterate over collaborators and push onto an array of <li>
    	var tempCollab = [];
    	for (var key in this.collaborators) {
	        // Definte firebase reference to the user's data
	        this.reference = firebase.database().ref('users/'+key);
	        
	        // Fetch userName from user and add <li>
	        this.reference.once('value')
	        .then((data)=>{
	        	var role = this.collaborators[data.key].role;
	        	var removeButton = '';
	        	if (role === 'developer') {
	        		removeButton = <button onClick={() => this.removeUser(data.key)}>Remove</button>
	        	} else if (role === 'pending') {
					removeButton = <button onClick={() => this.cancelInvite(data.key)}>Cancel</button>
	        	}
	    		tempCollab.push(
	    			<li key={data.key}>{data.val().username} [{this.collaborators[data.key].role}] {removeButton}</li>
	    		)

		    	// Save array of <li> to state for re-rendering
				if (this._isMounted) this.setState( { renderedCollaborators: tempCollab } ); 
	        })
    	}
    }

    addUser = () => {
    	this.userAdded = false;
    	firebase.database().ref('users').orderByChild('username').equalTo(this.state.userAddField)
    	.once('child_added')
    	.then((data) => {
    		var userID = data.key;
    		var projectID = firebase.currentProjectID;

    		// Add as developer into project
    		firebase.database().ref('projects/'+ projectID +'/users/'+userID)
    		.set({role:'pending'});

    		// Invite user
    		firebase.database().ref('users/'+userID+'/notifications').push({
    			type: 'project-invite',
    			content: projectID,
    			read: false,
    		});

    		this.userAdded = true;
    	})
    	.catch((error) => {
    		console.log(error);
			if (!this.userAdded) {
				console.log('User not found');
			}
    	});
    }

    removeUser = (userID) => {
    	var projectID = firebase.currentProjectID;
    	firebase.database().ref('users/'+userID+'/projects/'+projectID).remove();
    	firebase.database().ref('projects/'+projectID+'/users/'+userID).remove();
    }

    cancelInvite = (userID) => {
    	var projectID = firebase.currentProjectID;
    	firebase.database().ref('projects/'+projectID+'/users/'+userID).remove();
    }

    render() {
        return (
            <div>
            	<div class='project-settings-panel'>
	                <h3>Options</h3>
	                <p>Project Name: <EditableTextView
	                    value={this.state.projectTitle}
	                    onChange={(data) => this.updateField('title', data)}
	                /> </p>
	                <button onClick={() => {
						firebase.deleteProject(firebase.currentProjectID);
	                	hashHistory.push('/projects');
	                }}>Delete Project</button>
	            </div>

            	<div class='project-settings-panel'>
                	<h3>Collaborators</h3>
                	<ul>{this.state.renderedCollaborators}</ul>
                	<input 
                		onChange={(e) => {
                        	this.setState( { userAddField : e.target.value } );
                    	}}
	                    onKeyPress={(e) => {
	                        if (e.keyCode || e.which == 13) this.addUser();
	                    }}
                    	defaultValue={this.state.userAddField}
                    />
                	<button onClick={() => this.addUser()}>Add User</button>
            	</div>
            </div>
        );
    }

}
