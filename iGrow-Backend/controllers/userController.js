const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    //check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // if (!user.verified) {
    //   return res.status(403).json({ message: "Account not verified" });
    // }
    // //generate a token
    // const token = jwt.sign({ userId: user._id }, "gWlkpvmeYqas79948OiH");
    const name = user.name;
    const id = user._id;
    const role = user.role;
//testlang
    res.status(200).json({  name, id, role });
    console.log("Login Successfully")
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
};

exports.Register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      //check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email was already registered" });
      }
      //create a new user
      const newUser = new User({ name, email, password });
      //genereate and store the verification token
      newUser.verificationToken = crypto.randomBytes(20).toString("hex");
      //save the user to the database
      await newUser.save();
      res.status(200).json({ message: "Registration Successfull" });
    } catch (error) {
      console.log("error registering user", error);
      res.status(500).json({ message: "Registration Failed" });
}};










