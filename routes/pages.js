const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');
const jwt = require('jsonwebtoken');


//GET ROUTES
router.get('/', (req, res) => {
    var token = req.cookies.jwt
    //console.log(token)
    if (!token){
        return res.render('index');
    }
    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
        if (error) return error
        //console.log(decoded)
        //console.log(decoded.username)  
        const username = decoded.username
         
        return res.status(200).render('profile', {
                
            status:"Logged in as " + username,
            name: username
        })
    })
    
    
})

router.get('/about', (req, res) => {
    var token = req.cookies.jwt
    //console.log(token)
    if (!token){
        return res.render('about');
    }
    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
        if (error) return error
        
        //console.log(decoded.username)  
        const username = decoded.username
         
        return res.status(200).render('about', {
                
            status:"Logged in as " + username
        })
    })
})

router.get('/contact', (req, res) => {
    var token = req.cookies.jwt
    //console.log(token)
    if (!token){
        return res.render('contact');
    }
    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
        if (error) return error
        
        //console.log(decoded.username)  
        const username = decoded.username
         
        return res.status(200).render('contact', {
                
            status:"Logged in as " + username
        })
    })
})

router.get('/register', (req, res) => {
    var token = req.cookies.jwt
    //console.log(token)
    //checkToken();
    if (checkToken(token)===true){
         
        return res.status(200).render('register', {
                
            status:"Logged in as " + username
        })
    }else return res.render('register')
})

function checkToken(token){
    if (!token){
        return false
    }
    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
        if (error) return error
        
        //console.log(decoded.username)  
       
        loggedinname = decoded.username
        return (true)
    })
}




//POST ROUTES

router.post('/login', authController.login )
router.post('/registereduser', authController.register )
router.post('/logout', authController.logout )

router.post('/imageupload', authController.imgupload )


module.exports = router;