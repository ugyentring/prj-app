const express = require("express");
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the specified directory
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Middleware to set the Content-Type header for all JavaScript files
app.use('*.js', (req, res, next) => {
    res.header('Content-Type', 'application/javascript');
    next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS for all routes
app.use(cors());

// Controller
const eventRouter = require('./routes/event');
const userRouter = require('./routes/user');
// const viewRouter = require("./routes/view");
const ticketRouter = require("./routes/ticket");

app.use('/defiToken/v1/events', eventRouter);
app.use('/defiToken/v1/users', userRouter);
app.use('/defiToken/v1/tickets', ticketRouter);
// app.use("/", viewRouter);

module.exports = app;
