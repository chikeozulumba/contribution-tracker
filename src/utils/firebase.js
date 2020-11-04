import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBY_Gx__qeqYwHAYcUAA-UaSjrR2mfuJFE',
  authDomain: 'contribution-tracker.firebaseapp.com',
  databaseURL: 'https://contribution-tracker.firebaseio.com',
  projectId: 'contribution-tracker',
  storageBucket: 'contribution-tracker.appspot.com',
  messagingSenderId: '146972538478',
  appId: '1:146972538478:web:8ad66340c2ee8be591187f',
};

firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();

// collection references
const transactionCollection = db.collection('/transactions');
const userCollection = db.collection('/users');

// export utils/refs
export {
  db,
  auth,
  transactionCollection,
  userCollection,
};
