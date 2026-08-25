const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true 
    },
    dateOfbirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;