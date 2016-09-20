import React from 'react';

import Auth from '../components/Auth.js'

export default class Home extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <h2>Home</h2>
                <Auth />
            </div>
        );
    }
}
