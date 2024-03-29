const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const connectFlash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const dbUrl=process.env.ATLAS_URL

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mysupersecretecode"
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("error in mongo session")
})

const sessionOptions={
    // store,
    secret:"mysupersecretecode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.sucess=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    
    next();
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))





main().then(()=>{
    console.log("Connected to DB")
})
.catch(err => console.log(err));


// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
// }

async function main() {
    await mongoose.connect(dbUrl);
  }




// app.get("/demo",async(req,res)=>{
//     let fake=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     })
//     let use=await User.register(fake,"helloworld");
//     res.send(use);
//     console.log(use)


// })

app.use("/Listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message});
    next();
});

app.listen(8080,()=>{
    console.log("App is listening at port 8080 ");
})