# COMP4920 Project - Scrumptious

### Links
- [GitHub project (this project)](https://github.com/jrmarquard/scrumptious)
- [Firebase Scrumptious console](https://console.firebase.google.com/project/scrumptious-a4bc9)
- [Slack group](https://scrumptious4920.slack.com)
- [Deployed site (release)](https://s.crumptio.us/ or https://scrumptious-a4bc9.firebaseapp.com/)

### Setting up the project with Firebase
- Install [Node.js](https://nodejs.org/en/). This will also install npm.
- Install firebase-tools with npm: `npm install -g firebase-tools`.
- Firebase should now be installed. Run `firebase login` to login to Firebase and follow the prompts.
- Install webpack with npm: `npm install webpack -g`.
- Clone this repository.
- In the root of the repository, run npm install to install dependencies.
- Run `webpack` to build the app, `webpack -w` will allow you to make changes and it will automatically rebuild.
- Run `firebase serve` to serve the app so you can access it on localhost.

### Files
- `.firebaserc` is used by Firebase to assign aliases to your projects. The release website alias is `scrumptious-release`.
- `firebase.json` defines rules for Firebase used when running `firebase deploy` and `firebase serve`. Read more [here](https://www.firebase.com/docs/hosting/guide/full-config.html).
- `database.rules.json` outlines the database rules used by Firebase, used to assign rules to the database. When `firebase deploy` is run, it will overwrite the rules currently deployed rules - be careful.
- `/public` contains all the files to be deployed.

### Firebase Deployment and Serving
Read more [here](https://www.firebase.com/docs/hosting/command-line-tool.html).
 - `firebase deploy` will deploy the static assets and security rules. Everything will be overwritten.
 - `firebase deploy:hosting` will deploy only the static assets.
 - `firebase deploy:rules` will deploy only security rules.
 - `firebase deploy -m 'message'` will include a version message.
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
