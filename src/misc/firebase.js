import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
    apiKey: "AIzaSyAc-FjGVqSCyt5eBNq0KZk76xcU_SMnDRo",
    authDomain: "chat-web-app-martin-pio.firebaseapp.com",
    databaseURL: "https://chat-web-app-martin-pio-default-rtdb.firebaseio.com",
    projectId: "chat-web-app-martin-pio",
    storageBucket: "chat-web-app-martin-pio.appspot.com",
    messagingSenderId: "53826577355",
    appId: "1:53826577355:web:accb816b81ee65fd2b4c4e"
};

const app = firebase.initializeApp(config)

export const auth = app.auth()

export const database = app.database()
