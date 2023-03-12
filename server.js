require('dotenv').config() ; 
const express = require("express");
const app = express();
const hbs = require("hbs");
const exphbs  = require('express-handlebars');
const mongoose = require("mongoose");
const session = require("express-session");
// const flash = require("express-flash");
const flash = require("flash");
const MongoDBStore = require('connect-mongodb-session')(session) ; 
const hbsHelpers = require("./resources/js/hbsHelpers.js");
const moment = require('moment');

// const expressLayout = require('express-ejs-layouts') ;
const bodyParser = require("body-parser");

// app.use(expressLayout) ;

app.use(express.static("public"));
app.use(express.json()) ;  
app.use(express.urlencoded({extended:false})) ;

//Global Middleware : So that on refresh , cart data remains intact .
app.use((req,res,next)=>{
  res.locals.session = req.session ;
  next();
})

//Setup database
mongoose.set("strictQuery", true);
const connection = 
mongoose
  .connect(process.env.MONGO_DB_CONNECTION)
  .then(() => console.log("Connection  Successful with database . . ."))
  .catch((err) => console.log(err));
 
//Session Store in DataBase : Session automatically gets deleted from db once expired
const store = new MongoDBStore({
    uri: process.env.MONGO_DB_CONNECTION,
    collection: 'sessions'
});
 

//Session Configuration
app.use(session({
  secret:process.env.COOKIE_SECRET  , 
  resave:false,
  store:store,
  saveUninitialized:false,
  cookie:{maxAge:100 * 60 * 60 * 24} //24 hrs
})) ;

app.use(flash()) ; 


// Use the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Set template Engine : Handlebars
app.set("views", "resources/views");
app.set("view engine", "hbs");
hbs.registerPartials("resources/views/partials");


  

const PORT = process.env.PORT || 3005;

require("./routes/web.js")(app); //calling the function exported by web.js with the instance 'app'

app.use((req,res)=>{//Display the 404 Page , if Wrong Url Entered
  res.status(404).render('customers/404error') ;
})
 

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
