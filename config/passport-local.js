const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user');
//using middleware to find the user
//Authenticating user using passport js
passport.use(new LocalStrategy({
    usernameField:'email'
},
function(email,password,done){
    User.findOne({email:email},function(err,user){
        if(err){
            console.log("Error");
            return done(err);
        }
        if(!user || user.password != password){
            console.log("Invalid User");
            return done(null,false);
        }
        return done(null,user);
    });
}
));
//serializing the user
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//Deserializing the user
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("Error in deserializing");
            return done(err);
        }
        return done(null,user);
    });
});

//check if the user is Authenticated
passport.checkAuth=function(req,res,next){
if(req.isAuthenticated()){
    return next();
}
//if the user is not signed in 
return res.redirect('/users/sign-in');
}
//setting user data to locals
passport.setAuth=function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains info of the current signed in user from the session cookie and we are just sending this to locals for views
        res.locals.user=req.user;
    }
    next();
}
module.exports=passport;
