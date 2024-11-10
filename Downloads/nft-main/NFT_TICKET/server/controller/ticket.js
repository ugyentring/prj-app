const Ticket = require('../model/ticketModal')
const AppError = require('../utils/appError')
const nodemailer = require('nodemailer')
exports.getAllTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json({ data: tickets, status: "success" })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTickets = async (req, res) => {
    try {
        console.log(req.body)
        const tickets = await Ticket.create(req.body);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: tickets.email,
            subject: 'You have Successfully Booked your event Ticket',
            html: `
                <!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Receit</title>
                    
                        <style>
                            .card {
                                width: 275px;
                                height: auto;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                background-color: white;
                                border-radius: 20px;
                                padding: 30px;
                                gap: 10px;
                                border: 2px solid transparent;
                                transition: all 0.3s ease-in-out;
                                cursor: pointer;
                                border: 1px solid black;
                                margin: auto;
                            }
                    
                            .card:hover {
                                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
                            }
                    
                            .card>.image {
                                width: 70px;
                                height: 70px;
                                transition: all 0.1s ease-in-out;
                            }
                    
                            .card>.number-h1 {
                                font-size: 15px;
                                font-weight: bold;
                                padding: 5px 7px;
                                border-radius: 10px;
                                color: white;
                                background-color: #e57e25;
                            }
                    
                            .card>.h1 {
                                font-size: 17px;
                                font-weight: bold;
                                text-align: center;
                            }
                    
                            .card>.p {
                                color: #9e9da1;
                                font-size: 14px;
                                text-align: center;
                            }
                            .ticket-image{
                                width: 300px;
                                height: 140px;
                            }
                        </style>
                    
                    </head>
                    
                    <body>
                        <div class="card">
                            <img src="https://ipfs.io/ipfs/QmV9Cth492wtNQ97rF6DsrgLYLZJi4yrBMHak87bspaH5T?filename=EventTicket1.png" class="ticket-image" />
                            </div>
                    
                    
                    </body>
                    
                    </html>


                `
        };
        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.json({ data: tickets, status: "Success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTicketById = async (req, res) => {
    try {
        const tickets = await Ticket.findById(req.params.id);
        res.json({ data: tickets, status: " Success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const tickets = await Ticket.findByIdAndUpdate(req.params.id, req.body);
        res.json({ data: tickets, status: " Success" })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const tickets = await Ticket.findByIdAndDelete(req.params.id)
        res.json({ data: tickets, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


