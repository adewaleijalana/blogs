const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const postId = req.params.id;
    const { content } = req.body;

    const newComment = {
        id: commentId, content, status: 'pending'
    }

    const comments = commentsByPostId[postId] || [];

    comments.push(newComment);

    commentsByPostId[postId] = comments;

    try {

        await axios.post('http://localhost:4005/events', {
            type: 'CommentCreated',
            data: {
                ...newComment,
                postId: req.params.id,
                status: 'pending'
            }
        });

    } catch (error) {
        console.log(error);
    }

    res.status(201)
        .send(commentsByPostId);
});

app.post('/events', async(req, res) => {
    console.log('event received: ', req.body.type);
    const { type, data } = req.body;

    if (type === 'CommentModerated'){
        const { postId, id, status } = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => comment.id === id)
        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id: comment.id,
                postId: postId,
                content: comment.content,
                status: comment.status
            }
        });

    }
    res.send({});
})

app.listen(4001, () => {
    console.log('listening on port 4001')
})