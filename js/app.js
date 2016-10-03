// Import firebase
import "./Firebase.js"

// Include style sheet
require('./style.css');

// React Components
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, IndexRoute, IndexRedirect, hashHistory } from "react-router";

// Pages
import About from "./pages/About.js";
import Home from "./pages/Home.js";
import Interface from "./pages/Interface.js";
import Projects from "./pages/Projects.js";
import ProjectBoard from "./pages/ProjectBoard.js";
import ProjectContent from "./pages/ProjectContent.js";
import ProjectOverview from "./pages/ProjectOverview.js";
import ProjectSettings from "./pages/ProjectSettings.js";
import ProjectSprints from "./pages/ProjectSprints.js";
import ProjectStories from "./pages/ProjectStories.js";
import User from "./pages/User.js";

// Scrumptious
class Scrumptious extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={Interface}>  
                    <IndexRedirect to="home" />
                    <Route path="home" component={Home} />
                    <Route path="projects" component={Projects} />
                    <Route path="about" component={About} />
                    <Route path="user(/:userID)" component={User} />
                    <Route path="project/:projectID" component={ProjectContent}>
                        <IndexRoute component={ProjectOverview} />
                        <Route path="board" component={ProjectBoard} />
                        <Route path="sprints(/:sprintID)" component={ProjectSprints} />
                        <Route path="stories(/:storyID)" component={ProjectStories} />
                        <Route path="settings" component={ProjectSettings} />
                    </Route>
                </Route>
            </Router>
        );
    }
}

// Renders the Scrumptious component into the 'app' div
ReactDOM.render(<Scrumptious/>, document.getElementById('app'));
