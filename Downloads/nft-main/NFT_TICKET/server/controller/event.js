const Event = require("../model/eventModel");
const multer = require("multer")

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/event');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false)

    }
}

const upload = multer({
    fileFilter: multerFilter,
    storage: storage,
});

exports.upload = upload.single('photo')

exports.createEvent = async (req, res) => {
    try {
        if (req.file) {
            req.body.photo = req.file.filename;
        }
        const newEvent = await Event.create(req.body)
        res.json({ data: newEvent, status: "Success" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ data: events, status: "success" })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};


exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.json({ data: event, status: " Success" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};



exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                status: 'fail',
                message: 'Event not found',
            });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            data: {
                event,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};


exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                event,
            },
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};