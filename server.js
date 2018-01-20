const express = require('express');
const port = process.env.PORT || 5000;

var app = express();




app.get('/predictions', (req, res) => {
  res.send({
    bitcoin: 0.8,
    ethereum: 0.65,
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
