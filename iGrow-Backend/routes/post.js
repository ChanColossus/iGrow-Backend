const express = require("express");
const router = express.Router();
const { CreatePost,userPosts,AllUserPosts,getPostByUser,updatePost,deletePost } = require("../controllers/postController");
const {isAuthenticated} = require('../middlewares/auth.js')
const upload = require("../utils/multer");

router.post("/post-create",upload, CreatePost);
router.get("/post/:email", userPosts);
router.get("/posts", AllUserPosts);
router.get("/singlepost/:id", getPostByUser);
router.put('/update-post',updatePost);
router.delete("/post/:postId", deletePost);
module.exports = router;
