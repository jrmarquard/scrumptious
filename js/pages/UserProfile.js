import firebase from 'firebase';
import React from 'react';
import { Link } from "react-router";

import EditableTextView from '../components/EditableTextView.js';

import { Panel } from "react-bootstrap";

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
        this.userRef = firebase.database().ref('users/'+this.userID);

        // Attach a listener to all user's data
        this.userRef.on('value', this.userListener);
    }

    componentWillUnmount() {
        this.userRef.off();
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
            <div class='profile'>
                <Panel>
                    <div>
                        <h2>{this.state.name}</h2>
                    </div>
                    <div>
                        <h3>{this.state.username}</h3>
                    </div>
                    <div>
                        <Link to='/settings'>
                            <button>Edit your profile</button>
                        </Link>
                    </div>
                </Panel>
                <Panel>
                    <div>
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
                </Panel>
            </div>
        );
    }

}
