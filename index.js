// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const SHORTURL = []

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended: false}))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});
app.post("/api/shorturl", (request, response) => {
  const url = request.body.url.split("/")[2]
  return dns.lookup(url, function (err, addresses, family) {
    if (err) {
      return response.json({ error: 'invalid url' })
    }
    const json = { original_url: request.body.url, short_url:  SHORTURL.length+1}
    SHORTURL.push(json)
    response.json(json)
  });
})
app.get("/api/shorturl/:url", (request, response) => {
  const url = SHORTURL.filter(({short_url}) => short_url === Number(request.params.url))[0]
  response.redirect(url.original_url)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
