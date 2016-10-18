import firebase from 'firebase';
import React from 'react';

import { PageHeader, Panel, ListGroup, ListGroupItem, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import EditableTextView from './EditableTextView.js';
import { hashHistory } from 'react-router';

export default class ProjectSettingsOptions extends React.Component {
    // Required props for this Component
    static propTypes = {
        // Not really optional, marked this way to suppress warnings
        // when cloning the component using React.cloneElement
        projectID: React.PropTypes.string,
    }

    constructor() {
        super();
        this.state = {
            projectTitle : '',
            _loaded : false
        }
        this._isMounted = false;
        this.canTitleRename = false; 
    }

    componentDidMount() {
        this._isMounted = true;

        this.titleRef = firebase.database().ref('projects/'+this.props.projectID+'/title'); 

        this.titleRef.once('value').then((data) => {
            this.setState({projectTitle:data.val()})
            return data.val();
        }).then((initialTitle) => {
            this.initialTitle = initialTitle;
        }).then(() => {
            if (this._isMounted) this.setState({_loaded: true});
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getTitleValidation = () => {
        if (this.state.projectTitle.length === 0) {
            this.canTitleRename = false;
            return 'error';
        }
        if (this.state.projectTitle === this.initialTitle) {
            this.canTitleRename = false;
            return;
        } else {
            this.canTitleRename = true;
            return 'success';
        }

    }

    deleteProject = () => {
        // Get the users of the project
        firebase.database().ref('projects/'+this.props.projectID+'/users').once('value')
        .then((data) => {
            // save promises in removePromises
            var removePromises = []
            // Iterate over every user of the project
            for (var userID in data.val()) {
                // Remove user entry of project, and add promise to removePromises
                var promise = firebase.database().ref('users/'+userID+'/projects/'+this.props.projectID).remove() 
                removePromises.push(promise);
            }
            // Return a promise that only resolves when all provided promises are resolved
            return firebase.Promise.all(removePromises);
        })
        .then(() => {
            // Delete project itself
            return firebase.database().ref('projects/'+this.props.projectID).remove();
        })
        .then(() => hashHistory.push('/'));

    }

    renameProject = () => {
        if (this.canTitleRename) {
            this.titleRef.set(this.state.projectTitle)
            this.initialTitle = this.state.projectTitle;
        };
    }

    render() {
        if (!this.state._loaded) {
            return <Panel><PageHeader>Loading project data ...</PageHeader></Panel>
        }

        return (
            <Panel>
                <ListGroup fill>
                    <ListGroupItem>
                        {/* Project Title */}
                        <FormGroup controlId="formControlsTextarea" validationState={this.getTitleValidation()}>
                            <ControlLabel>Project Name</ControlLabel>
                            <FormControl 
                                type="text"
                                placeholder="Enter title"
                                value={this.state.projectTitle}
                                onChange={(e) => this.setState({projectTitle : e.target.value})}
                                onKeyPress={(e) => {if (e.keyCode || e.which == 13) this.renameProject()}}
                                />
                        </FormGroup>
                        <Button 
                            disabled={!this.canTitleRename}
                            onClick={() => this.renameProject()}
                            >
                            Rename
                        </Button>
                    </ListGroupItem>
                    <ListGroupItem>
                        {/* Project Description */}
                        <FormGroup controlId="formControlsTextarea">
                            <ControlLabel>Description</ControlLabel>
                            <FormControl 
                                componentClass="textarea"
                                type="text"
                                placeholder="Enter description"
                                onChange={(e) => this.setState({newStoryDescription : e.target.value})}
                                />
                        </FormGroup>
                        <Button 
                            disabled={!this.canTitleRename}
                            onClick={() => this.renameProject()}
                            >
                            Save
                        </Button>

                    </ListGroupItem>
                    <ListGroupItem>
                        <Button 
                            onClick={() => this.deleteProject()}
                            bsStyle='danger'
                            >
                        Delete Project</Button>
                    </ListGroupItem>
                </ListGroup>
            </Panel>
        );
    }
}
