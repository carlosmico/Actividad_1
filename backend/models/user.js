const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT = 10;
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');
const SECRET_JWT = require('../../config/password').SECRET_JWT;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    lastname: String,
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: (email) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(isEmail(email));
                }, 5);
            });
        }
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    confirmedEmail: Boolean,
    avatar: String
}, { timestamps: true });

//Esta función se ejecutará antes del save() del usuario y encriptará su password
userSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT)
            .then(salt => bcrypt.hash(user.password, salt)
                .then((hash) => {
                    user.password = hash;
                    console.log(user.password);
                    return next();
                })).catch(error => res.status(500).send(error));
    } else {
        next();
    }
});

userSchema.methods.toJSON = function() { //override of the toJSON method to add token and remove password fields
    const { _id, name, lastname, username, email, token } = this; //here we take the user properties
    return { _id, name, lastname, username, email, token }; //here we return the user properties
};

userSchema.methods.generateAuthToken = function() {
    const user = this;

    const token = jwt.sign({ _id: user._id }, SECRET_JWT, { expiresIn: '1h' });;
    return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;