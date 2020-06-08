const functions = require('firebase-functions');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const express = require('express')
const app = express()

const FBAuth = require('./util/fbAuth')

const {getAllPosts, postOnePost} = require('./handlers/posts')
const {signup,login, uploadImage} = require('./handlers/users')

//Post routes
app.get('/posts', getAllPosts)
app.post('/post',FBAuth, postOnePost)

//Signup route/
app.post('/signup',signup)
app.post('/login',login)
app.post('/user/image', FBAuth, uploadImage)
exports.api = functions.https.onRequest(app);
//exports.api = functions.region('europe-west1).https.onRequest(app) to change region