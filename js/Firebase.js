import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyAdvH1Onmp67QbgAzoeUuKH9lqZkbt-sPk",
    authDomain: "scrumptious-a4bc9.firebaseapp.com",
    databaseURL: "https://scrumptious-a4bc9.firebaseio.com",
    storageBucket: "scrumptious-a4bc9.appspot.com",
};
firebase.initializeApp(config);
firebase.tickets = firebase.database().ref('tickets');

firebase.addCurrentUser = () => {
    var currentUserID = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + currentUserID)
    .set({
        name: 'Scrumdiddlyumptious 2',
    })
    .then(() => {
        console.log("User added");
    })
    .catch((error) => {
        console.log("User add failed." + error.message);
    });
}
firebase.addTicket = () => {

}


firebase.createTicket = (payload) => {
    firebase.tickets.push({
        title: payload.title,
        description: payload.description,
        state: payload.state,
        priority: payload.priority
    });
}

firebase.updateTicket = (key, data) => {
    firebase.database().ref("tickets/"+key).update(data);
}

firebase.deleteTicket = (key) => {
    firebase.tickets.child(key).remove();
}

firebase.getTicket = (key) => {
    // returns a promise
    return firebase.tickets.once("value");
}
