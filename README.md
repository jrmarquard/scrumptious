# scrumptious
COMP4920 Project - Scrumptious

Firebase console page: [https://console.firebase.google.com/project/scrumptious-a4bc9](https://console.firebase.google.com/project/scrumptious-a4bc9)

### Files
- ` .firebaserc ` is used by Firebase to assign aliases to your projects. It is ignore by git. Set up yourself.
- ` firebase.json ` defines rules for Firebase. Read more [here](https://www.firebase.com/docs/hosting/guide/full-config.html).
- ` database.rules.json ` outlines the database rules used by Firebase, when firebase is deployed it will overwrite the rules currently deployed.

### Firebase Deployment
Read more [here](https://www.firebase.com/docs/hosting/command-line-tool.html).
 - `firebase deploy` will deploy the static assests and security rules. Everything will be overwriten.
 - `firebase deploy:hosting` will deploy only the static assets
 - `firebase deploy:rules` will deploy only security rules
 - `firebase deploy -m 'message'` will include a version message
 - `firebase serve` will run a local web server on [http://localhost:5000](http://localhost:5000).

### Firebase javascript configuration
Add this snippet at the bottom of the HTML or before other script tags.
```javascript
<script src="https://www.gstatic.com/firebasejs/3.4.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAdvH1Onmp67QbgAzoeUuKH9lqZkbt-sPk",
    authDomain: "scrumptious-a4bc9.firebaseapp.com",
    databaseURL: "https://scrumptious-a4bc9.firebaseio.com",
    storageBucket: "scrumptious-a4bc9.appspot.com",
  };
  firebase.initializeApp(config);
</script>
```