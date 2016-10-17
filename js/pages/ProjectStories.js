import React from 'react';
import { Link } from "react-router";

import { Grid, Col, Row, Panel, PanelGroup, ListGroup, ListGroupItem, FormGroup, FormControl, ControlLabel, Button} from "react-bootstrap";

import Story from '../components/Story.js';

export default class Stories extends React.Component { 

    constructor() {
        super();

        // stories will contain all stories and be expanded in render()
        this.state = {
            stories : [],
            newStoryTitle : '',
            newStoryDescription : ''
        }

        // Storage for stories as objects
        this.stories = {};

        // Flag to make sure state is not modified after unmounting
        this._isMounted = false;
    }

    componentDidMount = () => {
        // Set isMounted flag to true
        this._isMounted = true;

        // Get projectID from the url
        this.projectID = this.props.params.projectID;

        // Firebase reference to project stories
        this.storiesRef = firebase.database().ref('projects/'+this.projectID+'/stories');

        // Start listening to events from the project's' stories reference
        this.storiesRef.on('child_added', data => this.handleStories('child_added', data.key, data.val()));
        this.storiesRef.on('child_changed', data => this.handleStories('child_changed', data.key, data.val()));
        this.storiesRef.on('child_removed', data => this.handleStories('child_removed', data.key, data.val()));
    }

    coomponentWillUnmount() {
        // Set isMounted flag to false
        this._isMounted = false;

        // Stop listening to events from from the project's stories reference
        this.storiesRef.off();
    }

    addStory = () => {
        // Push new story to the project's stories reference
        this.storiesRef.push({
            title : this.state.newStoryTitle,
            description : this.state.newStoryDescription,
            timeCreated : Date.now()
        })
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

    getTitleValidation = () => {
        const length = this.state.newStoryTitle.length;
        if (length === 0) {
            return;
        } else if (length > 0 && length < 50) {
            return 'success';
        } else {
            return 'error';
        }
    }
    getDescriptionValidation = () => {
        const length = this.state.newStoryDescription.length;
        if (length === 0) {
            return;
        } else if (length > 0 && length < 200) {
            return 'success';
        } else {
            return 'error';
        }
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
                    <Col lg={2} md={3} xs={4}>
                        <Panel>
                            <h3>Filters</h3>
                            <ListGroup fill>
                                <ListGroupItem>
                                    Date
                                </ListGroupItem>
                                <ListGroupItem>
                                    Status
                                </ListGroupItem>
                                <ListGroupItem>
                                    Tag
                                </ListGroupItem>
                            </ListGroup>
                        </Panel>
                    </Col>

                    <Col lg={10} md={9} xs={8}>
                        {/* Create new stories panel */}
                        <PanelGroup accordion>
                            <Panel header="Add new story" eventKey="1">
                                    {/* New story title */}
                                    <FormGroup controlId="formBasicText" validationState={this.getTitleValidation()}>
                                        <ControlLabel>Title</ControlLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="Enter title"
                                            onChange={(e) => this.setState({newStoryTitle : e.target.value})}
                                            />
                                    </FormGroup>
                                    
                                    {/* New story description */}
                                    <FormGroup controlId="formControlsTextarea" validationState={this.getDescriptionValidation()}>
                                        <ControlLabel>Description</ControlLabel>
                                        <FormControl 
                                            componentClass="textarea"
                                            type="text"
                                            placeholder="Enter description"
                                            onChange={(e) => this.setState({newStoryDescription : e.target.value})}
                                            />
                                    </FormGroup>
                                    <Button
                                        bsStyle="success" 
                                        onClick={() => this.addStory()}>
                                        Create new story
                                    </Button>
                            </Panel>
                        </PanelGroup>

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
