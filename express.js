const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express();
const port = 3001;
const path = require('path');


app.use(bodyParser.urlencoded({ extended: true }));

let travelHistory = [];

function bookTravel(destination, date) {
    const tourDate = moment(date, 'YYYY-MM-DD');
    const currentDate = moment();
    const daysDifference = tourDate.diff(currentDate, 'days');

    let cost;

    if (daysDifference < 7) {
        cost = 1000;
    } else if (daysDifference < 30) {
        cost = 700;
    } else {
        cost = 500;
    }

    const bookingDetails = `Booked a trip to ${destination} on ${date}. Cost: $${cost}`;
    return bookingDetails;
}

function renderTravelHistory() {
    if (travelHistory.length === 0) {
        return '<p>No travel history available.</p>';
    }
    return travelHistory.map(entry => `<p>${entry.timestamp}: ${entry.bookingDetails}</p>`).join('');
}

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/booktrip', (req, res) => {
    const { destination, date } = req.body;

    const bookingDetails = bookTravel(destination, date);

    console.log('Booking Details:', bookingDetails);

    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    travelHistory.push({ timestamp, bookingDetails });

    res.send(`<h3>Booking Details:</h3><p>${bookingDetails}</p>`);
});

app.get('/travelhistory', (req, res) => {
    res.send(`<h3>Travel History:</h3>${renderTravelHistory()}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
