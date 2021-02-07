/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAc-FjGVqSCyt5eBNq0KZk76xcU_SMnDRo",
    authDomain: "chat-web-app-martin-pio.firebaseapp.com",
    databaseURL: "https://chat-web-app-martin-pio-default-rtdb.firebaseio.com",
    projectId: "chat-web-app-martin-pio",
    storageBucket: "chat-web-app-martin-pio.appspot.com",
    messagingSenderId: "53826577355",
    appId: "1:53826577355:web:accb816b81ee65fd2b4c4e"
});

firebase.messaging();