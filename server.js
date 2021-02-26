const express = require("express");
const path = require("path");
const db = require("./dbConnect");
const cookieParser = require('cookie-parser');


const port = 4000;
let app = express();


const publicDirectory = path.join(__dirname, './public');  //to read CSS from public folder
app.use(express.static(publicDirectory));

//Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true}));
app.use(express.json());



app.use(cookieParser()); // to read cookies

app.set('view engine', 'hbs');

db.connect(function(err) {  // to check that server successfully connects with the database//NOT NEEDED 
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});


//Define Routes

app.use('/', require('./routes/pages'));



app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
  })

  



