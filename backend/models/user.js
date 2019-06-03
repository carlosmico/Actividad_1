const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const SALT = 10;
const { isEmail } = require('validator');

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
    }
});

// //Esta función se ejecutará antes del save() del usuario y encriptará su password
// userSchema.pre('save', function() {
//     const user = this;

//     if (user.isModified('password')) {
//         bcrypt.genSalt(SALT)
//             .then(salt => bcrypt.hash(user.password, salt)
//                 .then(hash => user.password = hash))
//             .catch(error => res.status(500).send(error));
//     }

//     next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;