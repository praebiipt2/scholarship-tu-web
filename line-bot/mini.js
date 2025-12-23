const express = require('express');
const app = express();
app.post('/webhook', (req, res) => {
  console.log('✅ /webhook minimal hit');
  res.status(200).end();
});
app.listen(3100, () => console.log('mini server :3100'));
