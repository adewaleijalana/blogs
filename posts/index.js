const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

const posts = {};
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    const newPost = {
        id, title
    }
    posts[id] = newPost
    console.log(posts);

    postEvent = {
        type: 'PostCreated',
        data: newPost
    }

    try {

        await axios.post('http://event-bus-service:4005/events', postEvent);

    } catch (error) {
        console.log(error);
    }

    res.status(201)
        .send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('received event', req.body.type);
    res.send({});
})

app.listen(4000, () => {
    console.log('v2');
    console.log('Listening on port 4000');
});