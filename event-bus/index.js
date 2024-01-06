const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

const events = [];

app.post('/events', async (req, res) => {
    const eventObj = req.body;
    console.log(`event: `, eventObj);
    events.push(eventObj)

    try {
        await axios.post('http://localhost:4000/events', eventObj);
    } catch (error) {
        console.log(error.message);
    }

    try {
        await axios.post('http://localhost:4001/events', eventObj);
    } catch (error) {
        console.log(error.message);
    }

    try {
        await axios.post('http://localhost:4002/events', eventObj);
    } catch (error) {
        console.log(error.message);
    }

    try {
        await axios.post('http://localhost:4003/events', eventObj);
    } catch (error) {
        console.log(error.message);
    }

    res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
    res.send(events);
})


app.listen(4005, () => {
    console.log('event bus is listening on port 4005')
})