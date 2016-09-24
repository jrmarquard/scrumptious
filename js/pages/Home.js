import React from 'react';
import firebase from 'firebase';

import Auth from '../components/Auth.js';

export default class Home extends React.Component {

    constructor() {
        super();
        this.projectsList = {}

        this.state = {
            projectName : '',
            projects : [],
        }
    }

    componentDidMount() {

        // Watches for projects in userID/projects/ 
        this.userProjects = firebase.database().ref('users/'+firebase.getCurrentUser().uid+'/projects');
        
        this.userProjects.on('child_added', (data) => {
            // Find the project in /projects
            firebase.database().ref('projects/'+data.key).once('value')
            .then((data) => {
                
                this.projectsList[data.key] = 
                (<li 
                    key={data.key}
                    onClick={() => firebase.changeProject(data.key)}
                    >
                    {data.val().title}
                    <button onClick={()=>{firebase.deleteProject(data.key)}} >Delete</button>
                </li>);
                
                this.refreshProjects();
            });
        });

        // Watches for deleted projects
        this.userProjects.on('child_removed', (data) => {
            delete this.projectsList[data.key];
            this.refreshProjects();
        });
        
        // Watches for project changes
        this.index = firebase.subscribe('project_change', (projectID) => {
            console.log(projectID);
        });

    }

    componentWillUnmount() {
        this.userProjects.off();
    }

    createProject = () => {
        firebase.createProject(firebase.getCurrentUser().uid, this.state.projectName);
        this.setState({projectName : ''});
    }

    refreshProjects = () => {
        var projects = Object.keys(this.projectsList).map(key => this.projectsList[key]);
        this.setState({projects : projects});
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
                <button onClick={() => {
                    firebase.unsubscribe('project_change', this.index);
                }}>Unsubscribe</button>
                <ul>{this.state.projects}</ul>
            </div>
        );
    }
}
