const express = require("express");
const router = express.Router();
const { Register,  Login, Verify,sendResetPasswordEmail,resetPassword,userProfile } = require("../controllers/userController");
const {isAuthenticated} = require('../middlewares/auth.js')
const upload = require("../utils/multer");
router.post("/register",upload, Register);
router.get("/verify/:token", Verify);
router.post("/login", Login);
router.get("/profile/:email", userProfile);
// router.get("/user", getAllUser);
// router.put("/userupdate/:userId",updateUserRole);
// router.delete("/userdel/:userId",deleteUser);
router.post("/forgot-password", sendResetPasswordEmail);
router.put('/reset-password',resetPassword);
module.exports = router;
