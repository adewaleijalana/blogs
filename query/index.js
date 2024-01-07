const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}

const handleEvents = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data
        posts[id] = { id, title, comments: [] };
    }
    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data
        const comments = posts[postId].comments;
        comments.push({
            "id": id,
            "content": content,
            "status": status
        })

    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    console.log(`type: ${type};`, "data: " + data)

    handleEvents(type, data);

    res.send({})
});

app.listen(4002, async () => {
    console.log('query service listing on port 4002');
    try {
        const res = await axios.get('http://event-bus-service:4005/events');
        for (let event of res.data) {
            console.log('Processing event: ', event.type);
            handleEvents(event.type, event.data);
        }

    } catch (error) {
        console.log(error.message);
    }
});