const mongoose = require('mongoose');
const validator = require('validator');

const ticketSchema = new mongoose.Schema({

  buyerId: {
    type: String,
    required: [true, 'Ticket Name is required!'],
  },
  ticketName: {
    type: String,
    required: [true, 'Ticket Name is required!'],
  },
  ticketCount: {
    type: Number,
    required: [true, "Ticket Count is required!"],
  },

  ticketId: {
    type: Number,
    required: [true, "Ticket Id is required!"],
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },


  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tickets = mongoose.model('Ticket', ticketSchema);

module.exports = Tickets;
