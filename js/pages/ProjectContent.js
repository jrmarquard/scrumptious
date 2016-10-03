import firebase from 'firebase';

import React from 'react';
import { Link } from "react-router";

import NavProject from '../components/NavProject.js';

export default class ProjectContent extends React.Component {
	constructor(props) {
		super();
        firebase.setCurrentProject(props.params.projectID);
        this.state = {
            projectTitle: ''
        }

	}

    componentDidMount() {
        firebase.database().ref('projects/' + firebase.currentProjectID + '/title')
        .on('value', (data) => {
            this.setState( {
                projectTitle: data.val()
            });
        });
    }
    componentWillUnmount() {
        firebase.database().ref('projects/' + firebase.currentProjectID + '/title').off();

    }

    render() {
        return (
            <div id='project-ui'>
                <h1>{this.state.projectTitle}</h1>
            	<NavProject projectID={this.props.params.projectID}/>
                <div id='project-page'>
                    {this.props.children}
                </div> 
            </div>
        );
    }

}
