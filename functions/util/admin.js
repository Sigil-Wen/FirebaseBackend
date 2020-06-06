const admin = require('firebase-admin')

admin.initializeApp()

const db = admin.firestore()// easier to access database

module.exports = {admin,db}