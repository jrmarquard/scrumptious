import React from 'react';
import { Link } from "react-router";

import EditableTextViewImproved from '../components/EditableTextViewImproved.js'

export default class User extends React.Component {
    constructor() {
        super();
        this.state = ( { name : ''} );
    }
    componentWillMount() {
        var currentUserID = firebase.auth().currentUser.uid;
        this.reference = firebase.database().ref('users/'+currentUserID);
        this.reference.on('value', this.userListener);
    }

    componentWillUnmount() {
        this.reference.off();
    }

    userListener = (data) => {
        var name = data.val().name;;
        this.setState( { name : name } );
    }

    updateField = (field, value) => {
        var currentUserID = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+currentUserID).child(field).set(value)
        .catch(() => console.log('Failed to change ' + field + ' to ' + value + '.'));
    }

    render() {
        return (
            <div>
                <h1>User Page</h1>
                <h3>Name: </h3>
                <EditableTextViewImproved
                    value={this.state.name}
                    onChange={(data) => this.updateField('name', data)}
                />
            </div>
        );
    }

}
