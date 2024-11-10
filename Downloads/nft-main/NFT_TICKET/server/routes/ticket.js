const express = require('express');
const router = express.Router()
const eventController = require("../controller/ticket");

router
    .route('/')
    .get(eventController.getAllTickets)
    .post(eventController.createTickets)

router
    .route('/:id')
    .get(eventController.getTicketById)
    .patch(eventController.updateTicket)
    .delete(eventController.deleteTicket)


module.exports = router;