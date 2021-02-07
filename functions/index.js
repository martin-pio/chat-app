/* eslint-disable */

const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-web-app-martin-pio-default-rtdb.firebaseio.com"
});
