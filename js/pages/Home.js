import React from 'react';

import Auth from '../components/Auth.js'

export default class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            projectName : '',
            projects : [],
        }
    }

    componentWillMount() {
        // Watches for projects
        this.reference = firebase.database().ref('users/'+firebase.getCurrentUser().uid+'/projects');
        this.reference.on('child_added', (data) => {

            var userProjectReference = data.val();
            var projectID = userProjectReference.projectID;
            var role = userProjectReference.role;

            firebase.database().ref('projects/'+projectID).once('value', (data) => {
                var projects = this.state.projects;
                projects.push(<li key={data.key}>{data.val().title}</li>);
                this.setState({projects : projects});
            });
        });
    }

    componentWillUnmount() {
        this.reference.off();
    }

    createProject = () => {
        var userID = firebase.getCurrentUser().uid;
        firebase.database().ref('projects').push({
            title: this.state.projectName,
            owner: userID,
        })
        .then((data) => {
            var userID = firebase.getCurrentUser().uid;
            var projectID = data.getKey();

            return firebase.database().ref('users/' + userID + '/projects')
            .push({
                projectID : projectID,
                role : 'owner'
            });
        })
        .then((data) => {
            console.log('Created new project');
        })
        .catch((data) => {
            console.log('Failed to create new project');
            console.log(data);
        });
        this.setState({projectName : ''});
    }

    render() {
        return (
            <div>
                <h2>Home</h2>
                <input
                    onChange={(e) => this.setState({projectName : e.target.value})}
                    onKeyPress={(e) => {if (e.which == 13) this.createProject()}}
                    value={this.state.projectName}
                    placeholder="Project Name"
                />
                <button onClick={this.createProject}>Create</button>
                <ul>{this.state.projects}</ul>

            </div>
        );
    }
}
