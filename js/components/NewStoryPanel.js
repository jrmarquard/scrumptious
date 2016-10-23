import React from 'react';

import { PanelGroup, Panel, FormGroup, FormControl, ControlLabel, Button} from "react-bootstrap";

export default class NewStoryPanel extends React.Component {

    constructor() {
        super();
        this.state = {
            newStoryTitle : '',
            newStoryDescription : ''
        }
        this.isTitleValid = false;
    }

    addStory = () => {
        // If title is invalid don't add story
        if (!this.isTitleValid) return;

        // Push new story to the project's stories reference
        this.props.storiesRef.push({
            title : this.state.newStoryTitle,
            description : this.state.newStoryDescription,
            timeCreated : Date.now()
        })
    }

    getTitleValidation = () => {
        const length = this.state.newStoryTitle.length;
        if (length > 0 && length < 50) {
            this.isTitleValid = true;
            return 'success';
        } else {
            this.isTitleValid = false;
            return 'error';
        }
    }

    render() {

        return (
            <PanelGroup accordion>
                <Panel header="Add new story" class="pointer" eventKey="1">
                    {/* New story title */}
                    <FormGroup controlId="formBasicText" validationState={this.getTitleValidation()}>
                        <ControlLabel>Title</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Enter title"
                            onChange={(e) => this.setState({newStoryTitle : e.target.value})}
                            onKeyPress={(e) => {if (e.keyCode || e.which == 13) this.addStory()}}
                            />
                    </FormGroup>

                    {/* New story description */}
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
                        bsStyle="success"
                        onClick={() => this.addStory()}>
                        Create new story
                    </Button>
                </Panel>
            </PanelGroup>
        )
    }
}
