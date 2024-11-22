const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const firebase = require("firebase/app");
require("firebase/auth");
const app = express();
const port = 8000;
const cors = require("cors");
const user = require("./routes/user");
const post = require("./routes/post");
// const bevvies = require("./routes/bevvies");
// const munchies = require("./routes/munchies");
// const inventory = require("./routes/inventory");
// const review = require("./routes/review");
// const munchiesrev = require("./routes/munchiesreview")
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://igrowdsa4:BxFc5B5x1N0HHvMQ@igrow.hxc11.mongodb.net/iGrow?retryWrites=true&w=majority&appName=iGrow",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});
// const firebaseConfig = {
//   apiKey: "AIzaSyAHL2bJW2dZ08CQRaPOSMTIVuYJRd1LWVM",
//   authDomain: "igrow-7c344.firebaseapp.com",
//   projectId: "igrow-7c344",
//   storageBucket: "igrow-7c344.appspot.com",
//   messagingSenderId: "669713364638",
//   appId: "1:669713364638:web:f496cd0fbc804bae086d8f",
//   measurementId: "G-XEGV286Q84"
// };
// firebase.initializeApp(firebaseConfig);
cloudinary.config({
  cloud_name: "dwa3swpre",
  api_key: "751665811157982",
  api_secret: "pRIeYrGPpff5jfMWC5y0RcaN5cs",
});
app.use(user);
app.use(post);
// app.use(munchies);
// app.use(order);
// app.use(inventory);
// app.use(review);
// app.use(munchiesrev);

