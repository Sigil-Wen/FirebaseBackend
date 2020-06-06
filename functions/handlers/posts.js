const {db} =  require('../util/admin')
exports.getAllPosts = (req, res)=> {
    db.collection('posts').orderBy('createdAt', 'desc').get()
    .then(data => {
        let posts = []
        data.forEach(doc => {
            posts.push({
                postId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                likeCount: doc.data().likeCount
            });
         })
        return res.json(posts);
    })
.catch(err => console.error(err))
}

exports.postOnePost = (req,res)=>{
    if(req.method !== 'POST'){
        return res.status(400).json({error: 'Method not allowed'})
    }
    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    }
    db.collection('posts').add(newPost)
    .then((doc)=>{
        res.json({message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
        res.status(500).json({error : 'something went wrong'})
        console.error(err)
    })
}