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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

