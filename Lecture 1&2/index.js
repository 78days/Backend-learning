require('dotenv').config()

const express = require('express');
const app = express();
const port = 3000;

app.get('/' , (req,res) => {
    res.send('<h1>hi</h1>')
})
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/twitter' , (req,res) => {
    res.send('hiteshdotcom')
})
app.listen(process.env.port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.get('/' , (req,res) => {
    res.send('<h1>hi</h1>')
})