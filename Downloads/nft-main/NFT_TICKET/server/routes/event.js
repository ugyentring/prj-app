const express = require('express');
const router = express.Router()
const eventController = require("../controller/event");

router
    .route('/')
    .get(eventController.getAllEvents)
    .post(eventController.upload , eventController.createEvent)

router
    .route('/:id')
    .get(eventController.getEventById)
    .patch(eventController.updateEvent)
    .delete(eventController.deleteEvent)


module.exports = router;