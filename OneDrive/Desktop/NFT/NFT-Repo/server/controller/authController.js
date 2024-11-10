const User = require('./../model/userModal')
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError')
const nodemailer = require('nodemailer')
const { promisify } = require('util');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000
        ),
        httpOnly: true,
    }
    res.cookie('jwt', token, cookieOptions)
    res.status(statusCode).json({
        status: "Success",
        token,
        data: {
            user
        }
    })
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)
        createSendToken(newUser, 201, res)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.login = async (req, res, next) => {
    try {


        const { email, password } = req.body

        //check if the email and password exits
        if (!email || !password) {
            return next(new AppError("Please provide an email and password", 400))
        }

        //check if the user exits && and password is correct
        const user = await User.findOne({ email }).select('+password')


        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401))
        }

        // // Check if the email is verified
        // if (!user.emailVerified) {
        //     return next(new AppError('Email not verified', 401));
        // }

        //If everything is ok, send token to client 
        createSendToken(user, 201, res)


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.getEmail = async (req, res) => {
    const { id } = req.params;
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.send("User Does Not Exist");
    }
    try {
        res.render("verifiyEmail", { email: oldUser.email, status: "Not Verified" });
    } catch (err) {
        res.send("Not Verified");
    }
};

exports.verifyEmail = async (req, res) => {
    const { id } = req.params;

    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.send("User Does Not Exist");
    }
    await User.updateOne(
        { _id: id },
        {
            $set: {
                emailVerified: true,
            },
        }
    );
    res.render("verifiyEmail", { email: oldUser.email, status: "verified" });
};


exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(0),
        httpOnly: true,
    })
    res.status(200).json({ status: 'success' })
}

exports.updatePassword = async (req, res, next) => {
    try {
        //1 Getting user from collection
        const user = await User.findById(req.user.id).select('+password')

        //check if posted current password is correct
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            return next(new AppError('Your current password is wrong', 401))
        }

        //3 If so , update password
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm

        //4Log user in and sent JWT
        createSendToken(user, 200, res)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.User.role)) {
            return next(
                new AppError('You do not have persmission to perform this action', 403)
            )
        }
        next()
    }
}