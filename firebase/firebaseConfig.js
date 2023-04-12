const firebase = require('firebase');

const config = {

    apiKey: "AIzaSyBNwi1P-Cx7OGP670FwYToyJQP2oZBbL5k",
  
    authDomain: "nodejs-47afe.firebaseapp.com",
  
    projectId: "nodejs-47afe",
  
    storageBucket: "nodejs-47afe.appspot.com",
  
    messagingSenderId: "663196949872",
  
    appId: "1:663196949872:web:06a40f85038e92840b43b5",
  
    measurementId: "G-1EBRE4MZ5H"
  
  };
  
  
  // Initialize Firebase

  const app = initializeApp(config);

  module.exports = app;
  