const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { json } = require('body-parser');
const mongoose = require('mongoose');

const { port, db } = require('../config');
const {
  fetchDraft,
  createNewDraft,
  updateDraft,
  saveComment,
  deleteDraft,
} = require('./helpers');

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
        return createNewDraft(userID, postID, patch);
      }

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

app.get('/api/comments/drafts', (request, response) => {
  const { post_id: postID, user_id: userID } = request.query;

  fetchDraft(userID, postID)
    .then((oldDraft) => {
      if (oldDraft === 'noop') {
        response.status(200).send({
          draft: null,
        });
      }

      const { draft, updated_at } = oldDraft;
      response.status(200).send({
        draft,
        updated_at,
      });
    });
});

app.post('/api/comments', (request, response) => {
  const { postID, userID, comment } = request.body;

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

  if (!comment) {
    response.status(400).json({
      error: 'Empty comment. Ignoring.',
    });
  }

  saveComment(userID, postID, comment)
    .then(() => {
      response.sendStatus(201);
    })
    .then(() => {
      deleteDraft(userID, postID);
    })
    .catch((error) => {
      response.status(500).json({
        error,
      });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

