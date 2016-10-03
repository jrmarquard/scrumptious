import React from 'react';

export default class ProjectNav extends React.Component {
    constructor() {
        super();
        this.state = {
            currentProject: "Default Project",
        }
    }

    changeProject = (e) => {

        this.setState({currentProject : e.target.value});
        console.log('changing project: ' + e.target.value);
    }

    render() {
        // TODO: populate the projects list with real projects.
        var projects = [];
        projects.push(<option key={1} value="Default Project">Default Project</option>);
        projects.push(<option key={2} value="Second Project">Second Project</option>);

        return (
            <div>
                <form>
                    <select onChange={this.changeProject} selected={this.state.currentProject}>{projects}</select>
                </form>
            </div>
        )
    }
}
