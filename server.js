const express = require('express') ; 
const app = express() ; 
const hbs = require('hbs') ; 
// const expressLayout = require('express-ejs-layouts') ; 
const bodyParser = require('body-parser') ; 
        
// app.use(expressLayout) ; 
  
app.use(express.static('public')) ;          
  
// Use the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
//Set template Engines
app.set('views' , 'resources/views' ) ;
app.set('view engine' , 'hbs') ;  

const PORT = process.env.PORT || 3005 ;

app.get('/' ,  (req,res)=>{
    res.render('home') ; 
}); 

app.listen(PORT , ()=>{console.log(`Listening on Port ${PORT}`)}) ; 
  