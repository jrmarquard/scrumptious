import firebase from 'firebase';
import React from 'react';
import { hashHistory } from 'react-router';

import { Grid, Col, Row, Panel, PanelGroup, ListGroup, ListGroupItem, FormGroup, FormControl, ControlLabel, Button} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';

import EditableTextView from '../components/EditableTextView.js';
import ProjectSettingsNav from '../components/ProjectSettingsNav.js';

export default class ProjectConfiguration extends React.Component {
	constructor(props) {
		super();

        // Get projectID from the url
        this.projectID = props.params.projectID;
    }

    render() {
        // Attached the prop 'projectID' to children
        var newChildren = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, { projectID: this.projectID })
        });

        return (
            <Grid>
                {/* Header */}
                <Row>
                    <Col lg={12}>
                        <h1>Project Settings</h1>
                    </Col>
                </Row>

                {/* Stories content: filter box + stories feed */}
                <Row class='show-grid'>
                    <Col lg={2} md={3} xs={4}>
                        <ProjectSettingsNav projectID={this.projectID}/>
                    </Col>

                    <Col lg={10} md={9} xs={8}>
                        {newChildren}       
                    </Col>
                </Row>
            </Grid>
        );
    }

}
