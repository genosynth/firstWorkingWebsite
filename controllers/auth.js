const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const db = require("../dbConnect");

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})



exports.login = (req,res) =>{
    const { username, password } = req.body;
    console.log(req.body)

    db.query('SELECT * FROM accounts WHERE username = ?', [username], async(error,results) =>{
        if(results.length !=1 || !(await bcrypt.compare(password, results[0].password)) ) {
            res.render('index', {
        
                message: "Incorrect username or password!"
            })
        
        }else {
            const id = results[0].id
            const username = results[0].username //CONTINUE HERE

            const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            }
           
            res.cookie('jwt', token, cookieOptions);
            res.render('profile', {
        
                status: "Logged in as " + username,
                name: username
            })

        }
        

    })

    

    
}

exports.register = (req,res) =>{
    const { username, password, email } = req.body;
    console.log(req.body)

    db.query('SELECT * FROM accounts WHERE email = ?',[email], async(error, results, fields) =>{
        if (error) {
            res.json({
              status:false,
              message:'there are some error with query'
              })
        }else if(results.length >0){
            return res.render('register', {
        
                message: "Email already exists!"
            })
           
          }
          
            let hashedPassword = await bcrypt.hash(password, 8);
            db.query('INSERT INTO accounts SET ?',{username:username ,password:hashedPassword ,email:email}, function (error, results, fields) {
                if (results) {
                res.render('index', {
        
                    message: "User has been registered"
                    })

                }
            })
            
          
    })
}

exports.logout = (req,res) => {

    res.clearCookie('jwt').render('index', {
        message: 'You have successsfully logged Out'
    })

}

exports.imgupload = (req,res) => {
    const upload = multer({ storage }).single('image')
    upload(req, res, function(err) {
      if (err) {
        return res.send(err)
      }
      console.log('file uploaded to server')
      console.log(req.file)
  
      // SEND FILE TO CLOUDINARY
      const cloudinary = require('cloudinary').v2
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
      })
      
      const path = req.file.path
      const uniqueFilename = new Date().toISOString()
  
      cloudinary.uploader.upload(
        path,
        { public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
        function(err, image) {
          if (err) return res.send(err)
          console.log('file uploaded to Cloudinary')
          // remove file from server
          const fs = require('fs')
          fs.unlinkSync(path)
          // return image details
          res.json(image)
        }
      )
    })
       
}

  