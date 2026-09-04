const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());


// Student schema
const studentSchema = new mongoose.Schema({
    studentId: String,
    firstname: String,
    lastname: String,
    matricNumber: String,
    email: String,
    phone: String,
    dateofbirth: String,
    gender: String,
    address: String
});


// Admin schema
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }
});


// Contact schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,

    reply: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    repliedAt: {
        type: Date,
        default: null
    }
});


// Models
const Student = mongoose.model(
    "Student",
    studentSchema
);

const Admin = mongoose.model(
    "Admin",
    adminSchema
);

const Contact = mongoose.model(
    "Contact",
    contactSchema
);


// Test route
app.get("/test", function (req, res) {

    res.send(
        "Server connection is successful!"
    );
});


// Register admin
app.post(
    "/admin/register",
    async function (req, res) {

        try {

            const {
                name,
                email,
                password
            } = req.body;


            // Check fields
            if (
                !name ||
                !email ||
                !password
            ) {
                return res.status(400).json({
                    message:
                        "Please fill in all fields"
                });
            }


            // Check password length
            if (password.length < 6) {
                return res.status(400).json({
                    message:
                        "Password must be at least 6 characters"
                });
            }


            // Check email
            const existingAdmin =
                await Admin.findOne({
                    email: email.toLowerCase()
                });


            if (existingAdmin) {
                return res.status(400).json({
                    message:
                        "An admin with this email already exists"
                });
            }


            // Get all admins
            const admins =
                await Admin.find();


            // Check if password is already used
            for (const admin of admins) {

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        admin.password
                    );


                if (passwordMatch) {
                    return res.status(400).json({
                        message:
                            "This password is already being used by another admin. Please choose a different password."
                    });
                }
            }


            // Hash password
            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // Create admin
            const admin = new Admin({
                name: name,
                email: email.toLowerCase(),
                password: hashedPassword
            });


            await admin.save();


            res.status(201).json({
                message:
                    "Admin registered successfully!"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to register admin"
            });
        }
    }
);


// Admin login
app.post(
    "/admin/login",
    async function (req, res) {

        try {

            const {
                email,
                password
            } = req.body;


            const admin =
                await Admin.findOne({
                    email: email.toLowerCase()
                });


            if (!admin) {
                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });
            }


            // Check password
            const passwordMatch =
                await bcrypt.compare(
                    password,
                    admin.password
                );


            if (!passwordMatch) {
                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });
            }


            // Create token
            const token =
                jwt.sign(
                    {
                        id: admin._id,
                        email: admin.email,
                        role: "admin"
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn: "2h"
                    }
                );


            res.status(200).json({
                message:
                    "Login successful!",
                token: token
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Login failed"
            });
        }
    }
);


// Check admin
function authenticateAdmin(
    req,
    res,
    next
) {

    const authHeader =
        req.headers.authorization;


    if (!authHeader) {
        return res.status(401).json({
            message:
                "Access denied. Please log in."
        });
    }


    const token =
        authHeader.split(" ")[1];


    if (!token) {
        return res.status(401).json({
            message:
                "Invalid token"
        });
    }


    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        if (
            decoded.role !== "admin"
        ) {
            return res.status(403).json({
                message:
                    "Admin access required"
            });
        }


        req.admin = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message:
                "Session expired. Please log in again."
        });
    }
}


// Register student
app.post(
    "/students",
    async function (req, res) {

        try {

            const student =
                new Student(req.body);


            await student.save();


            res.status(201).json({
                message:
                    "Student registered successfully!",
                student: student
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Error registering student"
            });
        }
    }
);


// Get students
app.get(
    "/students",
    authenticateAdmin,
    async function (req, res) {

        try {

            const students =
                await Student.find();


            res.status(200).json(
                students
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to get students"
            });
        }
    }
);


// Update student
app.put(
    "/students/:id",
    authenticateAdmin,
    async function (req, res) {

        try {

            const student =
                await Student.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true
                    }
                );


            if (!student) {
                return res.status(404).json({
                    message:
                        "Student not found"
                });
            }


            res.status(200).json({
                message:
                    "Student updated successfully!",
                student: student
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to update student"
            });
        }
    }
);


// Delete student
app.delete(
    "/students/:id",
    authenticateAdmin,
    async function (req, res) {

        try {

            const student =
                await Student.findByIdAndDelete(
                    req.params.id
                );


            if (!student) {
                return res.status(404).json({
                    message:
                        "Student not found"
                });
            }


            res.status(200).json({
                message:
                    "Student deleted successfully!"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to delete student"
            });
        }
    }
);


// Save contact message
app.post(
    "/contacts",
    async function (req, res) {

        try {

            const {
                name,
                email,
                message
            } = req.body;


            if (
                !name ||
                !email ||
                !message
            ) {
                return res.status(400).json({
                    message:
                        "Please fill in all fields"
                });
            }


            const contact =
                new Contact({
                    name: name,
                    email: email,
                    message: message
                });


            await contact.save();


            res.status(201).json({
                message:
                    "Your message has been sent successfully!"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to send message"
            });
        }
    }
);


// Get messages
app.get(
    "/contacts",
    authenticateAdmin,
    async function (req, res) {

        try {

            const contacts =
                await Contact.find()
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json(
                contacts
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to get messages"
            });
        }
    }
);


// Reply to message
app.put(
    "/contacts/:id/reply",
    authenticateAdmin,
    async function (req, res) {

        try {

            const { reply } =
                req.body;


            if (
                !reply ||
                reply.trim() === ""
            ) {
                return res.status(400).json({
                    message:
                        "Please enter a reply"
                });
            }


            const contact =
                await Contact.findByIdAndUpdate(
                    req.params.id,
                    {
                        reply: reply,
                        repliedAt: new Date()
                    },
                    {
                        new: true
                    }
                );


            if (!contact) {
                return res.status(404).json({
                    message:
                        "Message not found"
                });
            }


            res.status(200).json({
                message:
                    "Reply saved successfully!",
                contact: contact
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to save reply"
            });
        }
    }
);


// Delete message
app.delete(
    "/contacts/:id",
    authenticateAdmin,
    async function (req, res) {

        try {

            const contact =
                await Contact.findByIdAndDelete(
                    req.params.id
                );


            if (!contact) {
                return res.status(404).json({
                    message:
                        "Message not found"
                });
            }


            res.status(200).json({
                message:
                    "Message deleted successfully!"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to delete message"
            });
        }
    }
);


// Connect to MongoDB
const connect = async function () {

    try {

        await mongoose.connect(
            process.env.MONGODB_URL
        );


        console.log(
            "Connected to MongoDB"
        );


        app.listen(
            3000,
            function () {

                console.log(
                    "App is listening on port 3000"
                );
            }
        );

    } catch (error) {

        console.error(
            "Error connecting to MongoDB:",
            error
        );
    }
};


// Start server
connect();