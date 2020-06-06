
const {db} =  require('../util/admin')

const config = require('../util/config')

const firebase = require('firebase')
firebase.initializeApp(config)
const {validateSignupData, validateLoginData} = require('../util/validators')


exports.signup = (req, res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    const {valid, errors} = validateSignupData(newUser)
    if(!valid) return res.status(400).json(errors)
////////////Add in weak passwords
    //validate data
    let token, userId
    db.doc(`/users/${newUser.handle}`).get() //gets doc using newUser handle to check if it exists
    .then((doc) => {
        if(doc.exists){
            return res.status(400).json({handle: 'this handle is already taken'})
        }else{
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(data => {
                userId = data.user.uid
                return data.user.getIdToken() //token used to access protected routes
            })
            .then( idToken =>{
                token = idToken;
                const userCredentials = {
                    handle: newUser.handle,
                    email: newUser.email,
                    createdAt: new Date().toISOString(),
                    userId
                }
                return db.doc(`/users/${newUser.handle}`).set(userCredentials) //creates new user with userhandle in users using userCredentials
            })
            .then(()=>{
                return res.status(201).json({token})
            })
            .catch(err =>{
                console.error(err)
                if(err.code === 'auth/email-already-in-use'){
                    return res.status(400).json({email: 'Email is already in use'})
                }else{
                  return res.status(500).json({error:  err.code})
                }
            })
        }
    })


}
exports.login = (req,res)=>{
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    const {valid, errors} = validateLoginData(user)
    if(!valid) return res.status(400).json(errors)


    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data =>{
        return data.user.getIdToken();
    })
    .then(token =>{
        return res.json({token})
    })
    .catch(err =>{
        console.error(err)
        if(err.code = 'auth/wrong-password'){
            return res.status(403).json({general: 'Wrong credentials, please try again'})
        }else{
          return res.status(500).json({error: err.code})
        }
})

}