var express = require("express");
var flash = require("connect-flash");
var passport =  require("passport");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");
var exphdbs = require("express-handlebars");
var cookie = require("cookie-parser");
var expressValidator = require("express-validator")
var session = require("express-session");

var routes = require("./routes/index")
var users = require("./routes/users")

//mongoose.connect("mongodb://localhost/users");
//var db = mongoose.connection();


//Express middle ware
var app = express();

// Set body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookie())

// Set middle for handlebars
app.set("views",path.join(__dirname,'./views'))
app.engine("handlebars",exphdbs({defaultLayout:'layout'}))
app.set("view engine","handlebars")

app.use(express.static(path.join(__dirname,"./public")))

app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}))

app.use(passport.initialize())
app.use(passport.session())

//express validaotr
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

app.use(function(req,res,next){
  console.log(req.user,"here")
	res.locals.success_msg =  req.flash('success_msg')
	res.locals.error_msg =  req.flash('error_msg')
	res.locals.error =  req.flash('error')
  res.locals.user =  req.user || null;
	next();
})

app.use("/",routes)
app.use("/user",users)

app.set("port",(process.env.PORT || 3000))
app.listen(app.get('port'),function(){
	console.log("Server Started")
})
