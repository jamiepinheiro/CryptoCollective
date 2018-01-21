const express = require('express');
const Twitter = require('twitter');
const https = require('https');

const port = process.env.PORT || 5000;

var app = express();

app.use(express.static('public'));

var client = new Twitter({
  consumer_key: '6NEEHw89UHPicD8AxrkcGG1h4',
  consumer_secret: 'TKRDjGqt8fj8P0mhESLlklLAjYTwZPyWzZ3u2BN0P9mVhBtOe4',
  access_token_key: '952431139741876224-O1XXi9YwADUm7AiGUxqbGrZ4aJfzHby',
  access_token_secret: 'kUsQmaUx7uLS0CLFkW1ZDbtXYcCHRQw7mlWf9RLRgV92y'
});

app.get('/predictions/:coin', async (req, res) => {

  var coin = req.params.coin;

  var tweets = null;
  try {
    tweets = await client.get('search/tweets', {q: coin, count: 30});
  } catch (e) {
    console.log(e);
  }

  var documents = tweets.statuses
  .map((status, i) => {
    return {
      language: status.lang,
      id: i + 1,
      text: status.text,
    }
  });

  var body = JSON.stringify({documents: documents});

  var response_handler = function (response) {
    var body = '';
    response.on ('data', function (d) {
      body += d;
    });
    response.on ('end', function () {

      try {
        var data = JSON.parse(body);
        var sum = 0;
        data.documents.forEach((doc) => {
          sum += doc.score;
        });

        var chances = sum / data.documents.length;
        res.send({chances});

      }catch(e) {
        res.status(400).send(e);
      }
    });
    response.on ('error', function (e) {
      res.status(400).send(e);
    });
};

  var get_sentiments = function(body) {

    var request_params = {
        method : 'POST',
        hostname : 'westcentralus.api.cognitive.microsoft.com',
        path : '/text/analytics/v2.0/sentiment',
        headers : {
            'Ocp-Apim-Subscription-Key' : '8fc477bb242e429ab9b197bb838553f5',
        }
    };

    var req = https.request(request_params, response_handler);
    req.write(body);
    req.end();
  }

  get_sentiments(body);

});


app.get('/', (req, res) => {
  res.status(404).send({error: 'Page not found'});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
