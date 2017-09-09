const express = require('express');
const morgan = require('morgan');
const { json } = require('body-parser');

const { port } = require('../config');

const app = express();

app.use(morgan('dev'));
app.use(json());

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

  3. An endpoint to move comment from partials to actual comments collection (POST)
*/

app.put('/comments/partials', (request, response) => {
  const { post_id: postID } = request.params;
  const { userID, commentPartial } = request.body;

  if (!userID) {
    response.status(401).json({
      error: 'Unauthorized',
    });

    return null;
  }

  if (!postID) {
    response.status(400).json({
      error: 'Post not set. Cannot process comment diff',
    });

    return null;
  }

  if (!commentPartial) {
    response.status(400).json({
      error: 'Empty comment diff. Ignoring.',
    });

    return null;
  }

  console.log(commentPartial);
  response.status(204);
});

app.get('/comments/partials', (request, response) => {

});

app.post('/comments', (request, response) => {

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

