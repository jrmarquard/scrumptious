import React from 'react';
import { Link } from "react-router";

export default class Nav extends React.Component {
    render() {
        return (
            <nav>
                <Link to="/"><div>Home</div></Link>
                <Link to="/board"><div>Board</div></Link>
                <Link to="/sprints"><div>Sprints</div></Link>
                <Link to="/stories"><div>Stories</div></Link>
                <Link to="/settings"><div>Settings</div></Link>
                <Link to="/about"><div>About</div></Link>
            </nav>
        );
    }

}
