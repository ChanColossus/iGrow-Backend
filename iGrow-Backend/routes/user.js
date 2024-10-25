const express = require("express");
const router = express.Router();
const { Register,  Login } = require("../controllers/userController");
const {isAuthenticated} = require('../middlewares/auth.js')
router.post("/register", Register);
// router.get("/verify/:token", Verify);
router.post("/login", Login);
// router.get("/profile",isAuthenticated, userProfile);
// router.get("/user", getAllUser);
// router.put("/userupdate/:userId",updateUserRole);
// router.delete("/userdel/:userId",deleteUser);
// router.post("/forgot-password", sendResetPasswordEmail);
// router.put('/reset-password',resetPassword);
module.exports = router;
