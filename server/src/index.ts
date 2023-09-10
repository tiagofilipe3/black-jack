// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use('/api', jsonServer.router('db.json'));

// Add your routes here for saving and retrieving player scores

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
