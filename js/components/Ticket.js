import React from 'react';
import firebase from 'firebase';

export default class Ticket extends React.Component {
    constructor(props) {
        super();
        console.log(props);
    }

    deleteTicket = () => {
        firebase.deleteTicket(this.key);
    }

    render() {
        const {key,title,description,state,priority} = this.props.ticket;
        this.key = key;
        return(
            <div class="ticket" id={key}>
                <h3>{title}</h3>
                <h4>{state} / {priority}</h4>
                <p>{description}</p>
                <button onClick={() => {firebase.deleteTicket(key);}}>Delete</button>
            </div>
        );
    }

}
