// Import firebase
import "./Firebase.js"

// Include style sheet
require('./style.css');

// React Components
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, IndexRoute, IndexRedirect, hashHistory } from "react-router";

// Pages
import Home from "./pages/Home.js";
import Interface from "./pages/Interface.js";
import Sprint from "./pages/Sprint.js";
import ProjectBacklog from "./pages/ProjectBacklog.js";
import ProjectContent from "./pages/ProjectContent.js";
import ProjectOverview from "./pages/ProjectOverview.js";
import ProjectSettings from "./pages/ProjectSettings.js";
import ProjectSprint from "./pages/ProjectSprint.js";
import ProjectSprints from "./pages/ProjectSprints.js";
import ProjectStories from "./pages/ProjectStories.js";
import Redirect404 from "./pages/Redirect404.js";
import SignUp from "./pages/SignUp.js";
import SignIn from "./pages/SignIn.js";
import UserProfile from "./pages/UserProfile.js";
import UserSettings from "./pages/UserSettings.js";

// Components
import ProjectSettingsOptions from "./components/ProjectSettingsOptions.js";
import ProjectSettingsUsers from "./components/ProjectSettingsUsers.js";

// Scrumptious
class Scrumptious extends React.Component {
    
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={Interface}>
                    <IndexRoute component={Home} />
                    <Route path="signup" component={SignUp} />
                    <Route path="signin" component={SignIn} />
                    <Route path="settings" component={UserSettings} />
                    <Route path="user/:userID" component={UserProfile} />
                    <Route path="project/:projectID" component={ProjectContent}>
                        <IndexRedirect from="" to="overview" />
                        <Route path="overview" component={ProjectOverview} />
                        <Route path="sprint" component={Sprint} />
                        <Route path="backlog" component={ProjectBacklog} />
                        <Route path="sprint/:sprintID" component={ProjectSprint} />
                        <Route path="sprints" component={ProjectSprints} />
                        <Route path="stories" component={ProjectStories} />
                        <Route path="settings" component={ProjectSettings} >
                            <IndexRedirect from="" to="options" />
                            <Route path="options" component={ProjectSettingsOptions} />
                            <Route path="users" component={ProjectSettingsUsers} />
                        </Route>
                    </Route>
                    <Route path="404" component={Redirect404} />
                </Route>
                <Redirect from="*" to="/404" />
            </Router>
        );
    }
}

// Renders the Scrumptious component into the 'app' div
ReactDOM.render(<Scrumptious/>, document.getElementById('app'));
