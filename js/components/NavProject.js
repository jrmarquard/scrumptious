import React from 'react';
import { Link } from "react-router";

export default class NavProject extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <h1>{this.props.projectTitle}</h1>
                <nav id='nav-project'>
                    <Link to={'/project/' + this.props.projectID + ''}><div>Overview</div></Link>
                    <Link to={'/project/' + this.props.projectID + '/board'}><div>Scrum Board</div></Link>
                    <Link to={'/project/' + this.props.projectID + '/sprints'}><div>Sprints</div></Link>
                    <Link to={'/project/' + this.props.projectID + '/stories'}><div>Stories</div></Link>
                    <Link to={'/project/' + this.props.projectID + '/settings'}><div>Settings</div></Link>
                </nav>
            </div>
        );
    }
}
