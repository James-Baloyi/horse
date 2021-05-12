import firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyDmxvEat9bQme3dRK5_Z79-tLWYrptYb6A",
    authDomain: "zipi-app.firebaseapp.com",
    databaseURL: "https://zipi-app.firebaseio.com",
    projectId: "zipi-app",
    storageBucket: "zipi-app.appspot.com",
    messagingSenderId: "1060972970372",
    appId: "1:1060972970372:web:787f7055d0de929a92ddd1",
    measurementId: "G-NGXNY0KN8X"
  };

  firebase.initializeApp(firebaseConfig);
  export default firebase;