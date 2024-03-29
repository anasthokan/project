const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js")

router.get("/signup",userController.renderSignupUser);

router.post("/signup",userController.Signup);

router.get("/login",userController.renderloginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.Login);

router.get("/logout",userController.logoutUser)

module.exports=router;