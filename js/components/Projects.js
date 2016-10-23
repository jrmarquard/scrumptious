import firebase from 'firebase';

import React from 'react';
import { Link } from "react-router";

import { Panel } from "react-bootstrap";

import ProjectsListItem from './ProjectsListItem.js';

export default class Projects extends React.Component {

    constructor() {
        super();
        this.projects = {};

        this.state = {
            newProjectName : '',
            projects : [],
        };
    }

    componentDidMount() {
        // Used to by callbacks to check if component is unmounted
        this._isMounted = true;

        // Set reference to firebase root in case it unmounts too quickly
        this.userProjects = firebase.database().ref('/');

        // When the auth state changes, subscribte to firebase references
        this.authUnsub = firebase.auth().onAuthStateChanged((user) => {
            // Watches for projects in userID/projects/
            this.userProjects = firebase.database().ref('users/'+user.uid+'/projects');

            this.userProjects.on('child_added', (data) => this.handleProjects('added', data.key, data.val()));
            this.userProjects.on('child_removed', (data) => this.handleProjects('removed', data.key, data.val()));
            this.userProjects.on('child_changed', (data) => this.handleProjects('changed', data.key, data.val()));
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.userProjects.off();
    }

    handleProjects = (event, projectID, relation) => {

        // Add or remove notification from component tracking
        if (event === 'added' || event === 'changed') {
            this.projects[projectID] = relation;
        } else if (event === 'removed') {
            delete this.projects[projectID];
        }

        var newProjects = [];
        for (var id in this.projects) {
            newProjects.push(
                <ProjectsListItem key={id} projectID={id} />
            )
        }

        // To stop a re-render if component has been unmounted
        if (this._isMounted) this.setState({projects : newProjects});
    }

    createProject = () => {
        //firebase.createProject(firebase.getCurrentUser().uid, this.state.newProjectName);

        var userID = firebase.auth().currentUser.uid;

        var userData = {
            role: 'owner',
            status: 'accepted'
        }

        var projectData = {
            title: this.state.newProjectName,
            timeCreated: Date.now(),
            users: {},
        }
        projectData.users[userID] = userData;

        var projectRef = firebase.database().ref('projects').push(projectData);

        //set up default statuses
        firebase.createStatusProject('To Do',1,false,projectRef.key);
        firebase.createStatusProject('In Progress',2,false,projectRef.key);
        firebase.createStatusProject('Code Review',3,false,projectRef.key);
        firebase.createStatusProject('Done',4,true,projectRef.key);

        firebase.database().ref('users/'+userID+'/projects/'+projectRef.key).set(userData);

        this.setState({newProjectName : ''});
    }

    refreshProjects = () => {
        var projects = Object.keys(this.projects).map(key => this.projects[key]);
        this.setState({projects : projects});
    }

    render() {
        return (
            <Panel class='user-projects-panel' header='Projects'>
                {this.state.projects}

                <div>
                    <input
                        onChange={(e) => this.setState({newProjectName : e.target.value})}
                        onKeyPress={(e) => {if (e.which == 13) this.createProject()}}
                        value={this.state.newProjectName}
                        placeholder="Project Name"
                    />
                    <button onClick={this.createProject}>Create</button>
                </div>
            </Panel>
        );
    }
}
