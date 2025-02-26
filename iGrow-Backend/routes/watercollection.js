const express = require("express");
const router = express.Router();
const {CreateData} = require("../controllers/waterCollectionController");
const {isAuthenticated} = require('../middlewares/auth.js')
const upload = require("../utils/multer");

router.post("/wc-create",upload,CreateData);
// router.get("/post/:email", userPosts);
// router.get("/posts", AllUserPosts);
// router.get("/singlepost/:id", getPostByUser);
// router.put('/update-post',updatePost);
// router.delete("/post/:postId", deletePost);
module.exports = router;
