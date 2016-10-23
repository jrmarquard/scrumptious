import firebase from 'firebase';
import React from 'react';
import { Link } from "react-router";

import { Grid, Col, Row, Panel, PanelGroup, ListGroup, ListGroupItem, FormGroup, FormControl, ControlLabel, Button} from "react-bootstrap";

import Story from '../components/Story.js';
import NewStoryPanel from '../components/NewStoryPanel.js';

export default class Stories extends React.Component {

    constructor() {
        super();

        // stories will contain all stories and be expanded in render()
        this.state = {
            stories : [],
            newStoryTitle : '',
            newStoryDescription : '',
            storiesPanelDisplay : 'hidden'
        }

        // Storage for stories as objects
        this.stories = {};

        // Flag to make sure state is not modified after unmounting
        this._isMounted = false;
    }

    componentWillMount = () => {
        // Get projectID from the url
        this.projectID = this.props.params.projectID;

        // Firebase reference to project stories
        this.storiesRef = firebase.database().ref('projects/'+this.projectID+'/stories');
    }

    componentDidMount = () => {

        // Start listening to events from the project's' stories reference
        this.storiesRef.on('child_added', data => this.handleStories('child_added', data.key, data.val()));
        this.storiesRef.on('child_changed', data => this.handleStories('child_changed', data.key, data.val()));
        this.storiesRef.on('child_removed', data => this.handleStories('child_removed', data.key, data.val()));

        // Set isMounted flag to true
        this._isMounted = true;
    }

    componentWillUnmount() {
        // Set isMounted flag to false
        this._isMounted = false;

        // Stop listening to events from from the project's stories reference
        this.storiesRef.off();
    }

    componentDidUpdate() {
        if (this.state.stories.length > 0) {
            if (this.state.storiesPanelDisplay != 'show') this.setState({storiesPanelDisplay : 'show'})
        } else {
            if (this.state.storiesPanelDisplay != 'hidden') this.setState({storiesPanelDisplay : 'hidden'})
        }
    }

    handleStories = (event, storyID, story) => {
        // Add, change, or remove
        if (event === 'child_added' || event === 'child_changed') {
            this.stories[storyID] = story;
        } else if (event === 'child_removed') {
            delete this.stories[storyID];
        }

        // Render stories to page
        var newStories = [];
        for (var id in this.stories) {
            var s = this.stories[id];
            newStories.push(
                <Story
                    key={id}
                    projectID={this.projectID}
                    storyID={id}
                    storyTitle={s.title}
                    storyDescription={s.description}
                    storyTime={s.timeCreated}
                    />
            )
        }

        // If the page is still mounted set a new state
        if (this._isMounted) this.setState({stories:newStories});
    }

    render() {
        return (
            <Grid>
                {/* Header */}
                <Row>
                    <Col lg={12}>
                        <h1>Stories</h1>
                    </Col>
                </Row>

                {/* Stories content: filter box + stories feed */}
                <Row class='show-grid'>
                    <Col xs={3}>
                        {/* Create new stories panel */}
                        <NewStoryPanel storiesRef={this.storiesRef}/>
                    </Col>

                    <Col xs={9} class={this.state.storiesPanelDisplay}>

                        {/* Display new stories here */}
                        <Panel>
                            {this.state.stories}
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }

}
