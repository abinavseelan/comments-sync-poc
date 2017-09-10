const mongoose = require('mongoose');

const DraftSchema = new mongoose.Schema({
  draft: {
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
  updated_at: {
    type: Date,
  },
});

const Draft = mongoose.model('Draft', DraftSchema);

module.exports = {
  Draft,
};
