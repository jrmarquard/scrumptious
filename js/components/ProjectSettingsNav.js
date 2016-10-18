import firebase from 'firebase';
import React from 'react';

import { Panel, ListGroup, ListGroupItem} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class ProjectSettingsNav extends React.Component {
    static propTypes = {
        projectID: React.PropTypes.any.isRequired
    }

    render() {
        return (
            <Panel>
                <ListGroup fill>
                    <LinkContainer to={'/project/'+this.props.projectID+'/settings/options'} >
                        <ListGroupItem>
                            Options
                        </ListGroupItem>
                    </LinkContainer>
                    <LinkContainer to={'/project/'+this.props.projectID+'/settings/users'} >
                        <ListGroupItem>
                            Users
                        </ListGroupItem>
                    </LinkContainer>
                </ListGroup>
            </Panel>
        );
    }
}