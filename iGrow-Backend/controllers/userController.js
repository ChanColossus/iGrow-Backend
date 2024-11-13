const User = require("../models/user");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");



const sendVerificationEmail = async (email, verificationToken) => {
  // Create an OAuth2 client
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oauth2Client.setCredentials({ access_token: REFRESH_TOKEN });

  try {
    // Generate a fresh access token
    const accessToken = (await oauth2Client.getAccessToken()).token;


    // Create a Nodemailer transporter using OAuth2 with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'igrowdsa4@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token, // Access token generated on each send attempt
      },
    });

    // Compose the email message
    const mailOptions = {
      from: 'iGrow.com <igrowdsa4@gmail.com>',
      to: email,
      subject: 'Email Verification',
      text: `Please click the following link to verify your email: http://192.168.100.117:8000/verify/${verificationToken}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending verification email', error);
  }
};


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

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email was already registered" });
    }
    // Create a new user
    const newUser = new User({ name, email, password });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the user to the database
    await newUser.save();
    
     
      const gmailConfig = {
        service: "gmail",
        auth: {
          user: "myrmiproductions@gmail.com",
          pass: "bkkg uqoq dbrh qhxm", // Generate an app-specific password for better security
        },
      };
    
      // Create a Nodemailer transporter using Gmail
      const transporter = nodemailer.createTransport(gmailConfig);
    
      const mailOptions = {
        from: "myrmiproductions@gmail.com", // Replace with your sender email
        to: newUser.email, // Recipient email
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






