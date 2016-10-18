import firebase from 'firebase';
import React from 'react';

import { Panel, Button } from 'react-bootstrap';

export default class Story extends React.Component {
    // Required props for this Component
    static propTypes = {
        projectID: React.PropTypes.any.isRequired,
        storyID: React.PropTypes.any.isRequired,
        storyTitle: React.PropTypes.any.isRequired,
        storyDescription: React.PropTypes.any.isRequired,
        storyTime: React.PropTypes.any.isRequired,
    }

    constructor() {
        super();
    }

    deleteStory = () => {
        firebase.database().ref('projects/'+this.props.projectID+'/stories/'+this.props.storyID).remove();
    }

    render() {
        var date = new Date(this.props.storyTime);

        return (
            <Panel>
                <h3>{this.props.storyTitle}</h3>
                <p>{this.props.storyDescription}</p>
                <p>Created on: {date.toString()}</p>
                <Button bsStyle="danger" onClick={() => this.deleteStory()}>
                    Delete
                </Button>
            </Panel>
        );
    }
}
