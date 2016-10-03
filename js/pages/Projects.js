import React from 'react';
import { Link } from "react-router";
import firebase from 'firebase';

import Auth from '../components/Auth.js';

export default class Home extends React.Component {

    constructor() {
        super();
        this.projectsList = {};


        this.state = {
            projectName : '',
            projects : [],
        };
    }

    componentDidMount() {

        // Used to by callbacks to check if component is unmounted
        this._isMounted = true;

        // Watches for project changes
        this.index = firebase.subscribe('project_change', (projectID) => {
            // TODO: do stuff
        });

        // Watches for projects in userID/projects/ 
        this.userProjects = firebase.database().ref('users/'+firebase.getCurrentUser().uid+'/projects');
        
        this.userProjects.on('child_added', (data) => {
            // Find the project in /projects
            firebase.database().ref('projects/'+data.key).once('value')
            .then((data) => {
                if (!this._isMounted) return;

                this.projectsList[data.key] = 
                (<li 
                    key={data.key}
                    onClick={() => firebase.setCurrentProject(data.key)}>
                    <Link to={'/project/' + data.key + '/'} >
                        {data.val().title}
                    </Link>
                    <button onClick={()=>{firebase.deleteProject(data.key)}} >Delete</button>
                </li>);
                
                this.refreshProjects();
            });
        });

        // Watches for deleted projects
        this.userProjects.on('child_removed', (data) => {
            if (!this._isMounted) return;
            delete this.projectsList[data.key];
            this.refreshProjects();
        });

    }

    componentWillUnmount() {
        this._isMounted = false;
        firebase.unsubscribe('project_change', this.index);
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
                <h2>Projects</h2>
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
