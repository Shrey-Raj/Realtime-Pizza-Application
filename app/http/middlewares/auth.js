function auth(req,res,next){
    if(req.session.name){
        return next() ;
    }
    
    return res.render('auth/login' , {message : 'Please Log In First '}) ; 
}

module.exports = auth ; 