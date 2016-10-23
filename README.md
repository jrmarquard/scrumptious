# COMP4920 Project - Scrumptious

## Links
- [GitHub project (this project)](https://github.com/jrmarquard/scrumptious)
- [Firebase Scrumptious console](https://console.firebase.google.com/project/scrumptious-a4bc9)
- [Slack group](https://scrumptious4920.slack.com)
- [Deployed site (release)](https://scrumptious-a4bc9.firebaseapp.com/)

## Setting up the project (Web App)
- Clone this repository
- Install [Node.js](https://nodejs.org/en/). This will also install npm.
- Install all Node.js tools using npm: `npm install`.
- `firebase login` to login to Firebase and follow the prompts (after you have been added to the Firebase project).
- `npm run serve` to run a local webserver at `localhost:8080`
- `npm run deploy` to deploy the website.    

## Files
- `webpack.config-deploy.js` are webpack's configuration for deployment.
- `webpack.config-development.js` are webpack's configuration for development.
- `.firebaserc` is used by Firebase to assign aliases to your projects. The release website alias is `scrumptious-release`.
- `firebase.json` defines rules for Firebase execution. Read more [here](https://www.firebase.com/docs/hosting/guide/full-config.html).
- `/public` contains all the files to be deployed.

## Extra documentation - not necesary to know this

### Firebase Deployment and Serving
Read more [here](https://www.firebase.com/docs/hosting/command-line-tool.html).
 - `firebase deploy` will deploy the static assests and security rules. Everything will be overwriten.
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
