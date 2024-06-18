const express = require('express');
const path = require('path');
const app = express();

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});

app.use(express.static(__dirname + '/dist/ip-location-app'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/ip-location-app/index.html'));
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Server is running on port', process.env.PORT || 8080);
});
