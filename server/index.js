const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { json } = require('body-parser');
const mongoose = require('mongoose');

const { port, db } = require('../config');
const { fetchDraft, createNewDraft, updateDraft } = require('./helpers');

const app = express();

app.use(morgan('dev'));
app.use(json());
app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
mongoose.connect(db);

app.get('/ping', (request, response) => {
  response.json({
    pong: 'true',
  });
});

/*
  Requirements:
  1. An endpoint to store the comment partials :- (PUT)
    - Take `post_id` as parameters and `user` information via token
    - Comment diff in the body
    - Query db, update comment string and save back in db
  # TODO : Find a way to prevent race-condition. Will that be handled by the client or the server? 🤔

  2. An endpoint to retrieve the partial comment (GET)

  3. An endpoint to save comment to actual comments collection and clear partial (POST)
*/

app.put('/api/comments/drafts', (request, response) => {
  const { userID, patch, postID } = request.body;

  if (!userID) {
    response.status(401).json({
      error: 'Unauthorized',
    });
  }

  if (!postID) {
    response.status(400).json({
      error: 'Post not set. Cannot process comment diff',
    });
  }

  if (!patch) {
    response.status(400).json({
      error: 'Empty comment diff. Ignoring.',
    });
  }

  fetchDraft(userID, postID)
    .then((oldDraft) => {
      if (oldDraft === 'noop') {
        return createNewDraft(userID, postID);
      }
      console.log(oldDraft);
      return updateDraft(oldDraft, patch);
    })
    .then(() => {
      response.sendStatus(204);
    })
    .catch((error) => {
      response.status(500).json({
        error,
      });
    });
});

app.get('/api/comments/draft', (request, response) => {

});

app.post('/api/comments', (request, response) => {

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

