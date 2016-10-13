import firebase from 'firebase';
import React from 'react';
import { Link } from "react-router";

import EditableTextView from '../components/EditableTextView.js'

export default class User extends React.Component {
    constructor(props) {
        super();

        this.userID = props.params.userID;

        this.state = {
            name : '',
            username : '',
            message: ''
        };
    }

    componentDidMount() {
        // Definte firebase reference to the user's data
        this.reference = firebase.database().ref('users/'+this.userID);

        // Attach a listener to all user's data
        this.reference.on('value', this.userListener);
    }

    componentWillUnmount() {
        this.reference.off();
    }

    userListener = (data) => {
        var name = data.val().name;
        var username = data.val().username;
        this.setState({ 
            name: name,
            username: username,
        });
    }

    updateField = (field, value) => {
        firebase.database().ref('users/'+this.userID).child(field).set(value)
        .catch(() => console.log('Failed to change ' + field + ' to ' + value + '.'));
    }

    sendMessage = () => {        
        firebase.database().ref('users/'+this.userID+'/notifications').push({
            type: 'message',
            content: this.state.message,
            read: false,
        });

        this.setState({
            message: ''
        })
    }

    render() {
        return (
            <div>
                <h1>Your Profile</h1>
                <h3>Name: </h3>
                <EditableTextView
                    value={this.state.name}
                    onChange={(data) => this.updateField('name', data)}
                />
                
                <h3>UserName: </h3>
                <EditableTextView
                    value={this.state.username}
                    onChange={(data) => this.updateField('username', data)}
                />

                <h3>Send Message</h3>
                <input 
                    onChange={(e) => {
                        this.setState( { message : e.target.value } );
                    }}
                    onKeyPress={(e) => {
                        if (e.keyCode || e.which == 13) this.sendMessage();
                    }}
                    value={this.state.message}
                />
                <button onClick={() => this.sendMessage()}>Send Message</button>

            </div>
        );
    }

}
