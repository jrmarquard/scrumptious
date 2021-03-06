import firebase from 'firebase'

// Configuration used to initialise firebase
var config = {
    apiKey: "AIzaSyAdvH1Onmp67QbgAzoeUuKH9lqZkbt-sPk",
    authDomain: "scrumptious-a4bc9.firebaseapp.com",
    databaseURL: "https://scrumptious-a4bc9.firebaseio.com",
    storageBucket: "scrumptious-a4bc9.appspot.com",
};

// initalise firebase
firebase.initializeApp(config);

/*****************/
/* Auth and user */
/*****************/

// Get the currently logged in users id
firebase.getCurrentUser = () => {
    return firebase.auth().currentUser;
}

firebase.addCurrentUser = (name, userName) => {
    var currentUserID = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + currentUserID)
    .set({
        name: name,
        username: userName,
    })
    .then(() => {
        console.log("User added");
    })
    .catch((error) => {
        console.log("User add failed." + error.message);
    });
}

/************/
/* Projects */
/************/

/**
 *  Create a project.
 *   - Create the project in /projects/
 *   - Create a reference to that project in the user's projects/
 *
 *  user: user id of the owner of the project
 *  title: title of the project
 */
firebase.createProject = (userID, title) => {
    console.log('makign project');

    var userID = userID;

    // Object to store project specific user information
    var usersData = {};
    usersData[userID] = {role : 'owner'};

    // Object to be stored in /projects/
    var project = {
        title : title,
        users : usersData,
    }

    // Create a project key in /projects/
    var projectRef = firebase.database().ref('projects').push();

    // Save project at the key location
    projectRef.set(project)
    .then((data) => {
        // Object to store projects the user is in
        // var projects = {};
        // projects[projectRef.key] = 'owner';

        firebase.database().ref('users/' + userID + '/projects/' + projectRef.key)
        .set('owner')
        .catch((data) => {
            // TODO: Remove projected added at projectID
            // Should never get here because of ".validate" rules in firebase
            console.log('Failed to create reference for user');
        });
    })
    .catch((error) => {
        console.log('Failed to create new project');
        console.log(error);
    });


}

firebase.completeSprint = (projectId) => {
    firebase.database().ref('projects').child(projectId).child('tickets')
        .orderByChild('sprint')
        .equalTo('current')
        .once('value', (data) => {
            var tickets = data.val();
            for (var id in tickets) {
                var ticket = tickets[id];
                var sta;
                firebase.database().ref('projects/'+firebase.currentProjectID+'/statuses/'+ ticket.status).on('value', (data) => {
                    sta = data.val();
                    console.log(status);
                  })
                if (sta.complete == true) {
                    ticket.sprint = 'completed';
                } else {
                    ticket.sprint = 'next';
                }
                firebase.database().ref('projects').child(projectId)
                    .child('tickets').child(id).set(ticket);
            }
        });
}

firebase.startSprint = (projectId) => {
    firebase.database().ref('projects').child(projectId).child('tickets')
        .orderByChild('sprint')
        .equalTo('next')
        .once('value', (data) => {
            var tickets = data.val();
            for (var id in tickets) {
                var ticket = tickets[id];
                ticket.sprint = 'current';
                firebase.database().ref('projects').child(projectId)
                    .child('tickets').child(id).set(ticket);
            }
        });
}

/**
 *  Delete a project.
 *   - Delete the project in /projects/
 *   - Remove the reference to the proejct in every user in that project
 */
firebase.deleteProject = (projectID) => {
    // Save projectID
    var projectID = projectID;

    // Get the users from the project
    firebase.database().ref('projects/'+projectID+'/users').once('value')
    .then((data) => {
        // Get the users' IDs
        var users = Object.keys(data.val());

        // For each of the users' IDs remove the project id from userID/projects
        users.forEach((userID) => {
            var promise = firebase.database().ref('users/'+userID+'/projects/'+projectID).remove()
            .catch(() => console.log('not deleted'));
        })
    })
    .then(() => {
        firebase.database().ref('projects/'+projectID).remove();
    })
    .catch((error) => {
        console.log('error:');
        console.log(error);
    })
}

/**
 *  Update a project
 *   - Update the project with
 */
firebase.updateProject = () => {
    // TODO:
}

/**
 *  Update a project
 *   - Update the project with
 */
firebase.addUserToProject = (projectID, user) => {
    // TODO:
}


/***********
 * Tickets
 *
 * Ticket funcionality for current project.
 * Current project must be set.
 */

/**
 *  Ticket funcionality for current project. Current project must be set.
 */
 firebase.createTicket = (title, description, status, assignee, points) => {
     firebase.database().ref('projects/'+firebase.currentProjectID+'/tickets')
     .push({
         title: title,
         description: description,
         status: status,
         assignee: assignee,
         points: points,
         sprint: 'backlog'
     });
 }
 firebase.createStatus = (status,order,isComplete) => {
     key = firebase.database().ref('projects/'+firebase.currentProjectID+'/statuses')
     .push({
         status:status,
         order:order,
         complete:isComplete
     });
     return key.getKey();
 }
 firebase.createStatusProject = (status,order,isComplete,currentProjectID) => {
      firebase.database().ref('projects/'+currentProjectID+'/statuses')
     .push({
         status:status,
         order:order,
         complete:isComplete
     });
 }
 firebase.updateStatus = (key, data) => {
     firebase.database().ref('projects/'+firebase.currentProjectID+'/status/'+key).update(data)
 }

firebase.updateTicket = (key, data) => {
    firebase.database().ref('projects/'+firebase.currentProjectID+'/tickets/'+key).update(data);
}

firebase.deleteTicket = (key) => {
    firebase.database().ref('projects/'+firebase.currentProjectID+'/tickets').child(key)
    .remove()
    .catch((err) => console.log(err));
}

firebase.deleteStatus = (key) => {
    firebase.database().ref('projects/'+firebase.currentProjectID+'/statuses').child(key)
    .remove()
    .catch((err) => console.log(err));
}

firebase.getTicket = (key) => {
    // returns a promise
    return firebase.database().ref('tickets').once('value', (data) => {
        console.log(data);
    });
}
firebase.createStatus = (status,order) => {
      firebase.database().ref('projects/'+firebase.currentProjectID+'/statuses')
     .push({
         status:status,
         order:order
     });
 }
 firebase.updateStatus = (key,data) => {
     firebase.database().ref('projects/'+firebase.currentProjectID+'/statuses/'+key).update(data)
 }

firebase.getTicketsBySprint = (projectId, sprint, cb) => {
    var tickets = {};
    var query = firebase.database().ref('projects').child(projectId).child('tickets')
        .orderByChild('sprint')
        .equalTo(sprint);

    query.on('child_added', (data) => {
        var ticket = data.val();
        tickets[data.key] = ticket;
        cb(tickets);
    });
    query.on('child_changed', (data) => {
        var ticket = data.val();
        if (data.key in tickets) {
            tickets[data.key] = ticket;
        }
        cb(tickets);
    });
    query.on('child_removed', (data) => {
        var ticket = data.val();
        if (data.key in tickets) {
            delete tickets[data.key];
        }
        cb(tickets);
    });
    return () => {
        query.off();
    };
}

firebase.hasActiveSprint = (projectId, cb) => {
    var query = firebase.database().ref('projects').child(projectId).child('tickets')
        .orderByChild('sprint')
        .equalTo('current')
        .limitToFirst(1);
    query.on('value', (data) => {
        cb(data.val() != null);
    });
    return () => {
        query.off();
    };
}

/*************
 * Listeners
 *
 * Events
 *  - project_change: this fires whenever the project is changed, giving the
 *    subscriber the project ID of the project changed to. When the subscription
 *    is made, the event is fire once. If no project selected, ID = 0.
 *
 */

// Subscribers
firebase.projectChangeSubscribers = new Array;
firebase.currentProjectID = 0;

firebase.subscribe = (event, f) => {
    if (event === 'project_change') {
        f(firebase.currentProjectID);
        return firebase.projectChangeSubscribers.push(f) - 1;
    } else {
        return null;
    }
}
firebase.unsubscribe = (event, i) => {
    if (event === 'project_change') {
        firebase.projectChangeSubscribers[i] = null;
    }
}

firebase.setCurrentProject = (projectID) => {
    firebase.currentProjectID = projectID;
    firebase.projectChangeSubscribers.forEach((f) => {
        if (f !== null) f(firebase.currentProjectID);
    });
}
