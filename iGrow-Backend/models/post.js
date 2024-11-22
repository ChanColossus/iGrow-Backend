const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter title'],
    },
    description: {
        type: String,
        required: [true, 'Please enter description'],
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
    },
    images: [
        {
          public_id: {
            type: String,
           
          },
          url: {
            type: String,
            
          },
        },
      ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post