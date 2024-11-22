const User = require("../models/user"); 
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const multer = require('multer');

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
  console.log(req.files);
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email was already registered" });
    }
    
  let images = [];

  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => file.path);
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    let imageDataUri = images[i];

    try {
      const result = await cloudinary.v2.uploader.upload(imageDataUri, {
        folder: "user",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  }
  dp = imagesLinks;
    const newUser = new User({ name, email, password, dp });

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();
    
     
      const gmailConfig = {
        service: "gmail",
        auth: {
          user: "myrmiproductions@gmail.com",
          pass: "bkkg uqoq dbrh qhxm",
        },
      };
    
     
      const transporter = nodemailer.createTransport(gmailConfig);
    
      const mailOptions = {
        from: "myrmiproductions@gmail.com", 
        to: newUser.email, 
        subject: "Verify your account",
        html: `
          <h3>Email Verification</h3>
          <p>Please click the link below to verify your email address:</p>
          <a href="http://192.168.100.117:8000/verify/${newUser.verificationToken}">Verify your email</a>
          <p>If not clickable browse this:</p>
          <a>http://192.168.100.117:8000/verify/${newUser.verificationToken}</a>
        `,
      };
      transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ message: "Registration Failed" });
  }
};

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

    res.status(200).json({ message: "Email Verified Successfully, Go back to Application" });
  } catch (error) {
    res.status(500).json({ message: "Email Verification Failed" });
  }
};

exports.sendResetPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();
    const gmailConfig = {
      service: "gmail",
      auth: {
        user: "myrmiproductions@gmail.com",
        pass: "bkkg uqoq dbrh qhxm", 
      },
    };
  

    const transporter = nodemailer.createTransport(gmailConfig);
    // const resetPasswordLink = `http://192.168.100.117/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: "myrmiproductions@gmail.com", 
      to: user.email, 
      subject: "Password Reset",
      html: `
        <h3>Password Reset</h3>
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>This is your reset Token: \n\n  ${resetToken}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.\n</p>
      `,
    };
    transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset password email sent successfully' });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  console.log(req.body)
  try {
    
    const { token, password } = req.body;

    // Find the user by the reset token
    const user = await User.findOne({ resetPasswordToken: token });

    // Check if the token is valid and not expired
    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Reset the user's password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.userProfile = async (req, res, next) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email });
  res.status(200).json({
    success: true,
    user,
  });
};



