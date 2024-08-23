const express = require('express');
const app = express();

// Create a simple route for the homepage
app.get('/', (req, res) => {
  res.send('Welcome to the Football Jersey Shop Backend!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
