import firebase from 'firebase';

import React from 'react';
import { Link } from "react-router";

import NavProject from '../components/NavProject.js';

export default class ProjectContent extends React.Component {
    render() {
        return (
            <div id='project-ui'>
                <div id='project-page'>
                    {this.props.children}
                </div>
            </div>
        );
    }

}
