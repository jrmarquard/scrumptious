// Import firebase
import "./Firebase.js"

// Include style sheet
require('./style.css');

// React Components
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory, IndexRedirect} from "react-router";

// Pages
import About from "./pages/About.js";
import Board from "./pages/Board.js";
import Home from "./pages/Home.js";
import Interface from "./pages/Interface.js";
import Settings from "./pages/Settings.js";
import Sprints from "./pages/Sprints.js";
import Stories from "./pages/Stories.js";

// Scrumptious
class Scrumptious extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={Interface}>
                    <IndexRoute component={Home} />
                    <Route path="board" component={Board} />
                    <Route path="sprints(/:sprint)" component={Sprints} />
                    <Route path="stories" component={Stories} />
                    <Route path="about" component={About} />
                    <Route path="settings" component={Settings} />
                </Route>
            </Router>
        );
    }
}

// Renders the Scrumptious component into the 'app' div
ReactDOM.render(<Scrumptious/>, document.getElementById('app'));
