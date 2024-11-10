const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    metaMaskAddress: {
        type: String,
        required: [true, 'Meta Mask Address is required!'],
        unique: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: 8, // You can adjust the minimum length as needed
        select: false, // This will exclude the password from query results by default
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password confirmation is required!'],
        validate: {
            // This custom validator ensures that password and passwordConfirm match
            validator: function (value) {
                return value === this.password;
            },
            message: 'Passwords do not match!',
        },
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // emailVerified: {
    //     type: Boolean,
    //     default: false
    // }
});


userSchema.pre('save', async function (next) {
    //only return password if the passwords was actually modified
    if (!this.isModified('password')) return next()

    //hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    //delete passwordconfirm field
    this.passwordConfirm = undefined
    next()
})


//Instance method is available in all document of certain collections 
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password !== '' &&
        update.password !== undefined &&
        update.password == update.passwordConfirm) {

        // Hash the password with cost of 12
        this.getUpdate().password = await bcrypt.hash(update.password, 12)

        // // Delete passwordConfirm field
        update.passwordConfirm = undefined
        next()
    } else
        next()
})


const User = mongoose.model('User', userSchema);

module.exports = User;
