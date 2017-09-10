const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
  },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
  Comment,
};
