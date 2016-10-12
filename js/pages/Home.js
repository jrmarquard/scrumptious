import React from 'react';

import Notifications from "../components/Notifications.js"

export default class Home extends React.Component {

    render() {
        return (
            <div>
                <h1>Home</h1>
                <Notifications />
            </div>
        );
    }

}
