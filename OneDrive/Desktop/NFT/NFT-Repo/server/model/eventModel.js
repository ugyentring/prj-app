const mongoose = require('mongoose');
const validator = require('validator');

const eventSchema = new mongoose.Schema({
  startDate: {
    type: String,
    required: [true, "Start Date is required!"],
  },
  endDate: {
    type: String,
    required: [true, "End Date is required!"], 
  },
  eventName: {
    type: String,
    required: [true, 'Event Name is required!'],
  },
  eventDescription: {
    type: String,
    required: [true, 'Event Description is required!'],
  },
  ticketName: {
    type: String,
    required: [true, 'Ticket Name is required!'],
  },
  ticketCount: {
    type: Number,
    required: [true, "Ticket Count is required!"],
  },
  price: {
    type: Number,
    required: [true, "Ticket Price is required"],
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please provide phone number"],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Events = mongoose.model('Event', eventSchema);

module.exports = Events;
