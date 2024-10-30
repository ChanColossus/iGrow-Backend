const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transport

  const transporter = nodemailer.createTransport({
    //configure the email service
    host: "sandbox.smtp.mailtrap.io",
    port: 2525, // or 465 or 587 or another Mailtrap port
    auth: {
      user: "fa59208cd93371",
      pass: "82bc14cd74667e",
    },
  });

  //compose the email message
  const mailOptions = {
    from: "iGrow.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://192.168.100.117:8000/verify/${verificationToken}`,
  };

  //send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending verification email", error);
  }
};

nodemailer;
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

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
    if (!user.verified) {
      return res.status(403).json({ message: "Account not verified" });
    }
    //generate a token
    const token = jwt.sign({ userId: user._id }, "gWlkpvmeYqas79948OiH");
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
      sendVerificationEmail(newUser.email, newUser.verificationToken);
      res.status(200).json({ message: "Registration Successfull" });
    } catch (error) {
      console.log("error registering user", error);
      res.status(500).json({ message: "Registration Failed" });
}};

exports.Verify = async (req, res, next) => {
  try {
    const token = req.params.token;

    //Find the user with the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email Verification Failed" });
  }
};






