import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('hello server');
});

const port = process.env.PORT || 3000;

const joke = [
    {
        id: 1,
        text: 'joke 1'
    }
];

app.get('/api/jokes', (req, res) => {
    res.json(joke);
});

app.listen(port, () => {
    console.log(`hi from ${port}`);
});