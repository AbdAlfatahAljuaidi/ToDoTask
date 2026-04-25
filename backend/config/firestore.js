const admin = require('firebase-admin');
const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);

admin.initializeApp({
 credential: admin.credential.cert({
   projectId: process.env.FIREBASE_PROJECT_ID,
   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
   privateKey
 })
});

const db = admin.firestore();

module.exports = db;