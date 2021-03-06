import firebase from 'firebase'
import React from 'react';
import { Link } from "react-router";

import { Panel } from "react-bootstrap";

export default class ProjectsListItem extends React.Component {
    // Required props for this Component
    static propTypes = {
        projectID: React.PropTypes.any.isRequired
    }

    constructor() {
        super();
        this.state = {
            projectTitle : '',
        }
    }

    componentDidMount() {
        // Used to by callbacks to check if component is unmounted
        this._isMounted = true;

        // Set reference to firebase root in case it unmounts too quickly
        this.projectRef = firebase.database().ref('/');

        // When the auth state changes, subscribte to firebase references
        this.authUnsub = firebase.auth().onAuthStateChanged((user) => {
            // Watches for projects in userID/projects/
            this.projectRef = firebase.database().ref('projects/'+this.props.projectID);

            this.projectRef.on('value', (data) => this.handleProject('value', data.key, data.val()));
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.projectRef.off();
    }

    handleProject = (event, id, data) => {
        if (this._isMounted) this.setState({ projectTitle: data.title});
    }

    render() {
        return (
            <div class='projects-list-item'>
                <Link to={'/project/' + this.props.projectID + '/sprint'}>
                    <div class='projects-list-item-header'>
                        {this.state.projectTitle}
                    </div>
                </Link>
            </div>
        );
    }
}
