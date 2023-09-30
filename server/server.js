const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require('./models/user');
const catchAsyncErrors = require('./catchAsyncErrors');
const ErrorHandler = require('./ErrorHandler');
const sendToken = require('./jwttoken');
const cookieParser = require('cookie-parser');
const { isAuthenticated } = require('./auth');
require('dotenv').config();

const app = require('express')();

app.use(cookieParser());


const allowedOrigins = ['http://localhost:3000', 'https://stunning-clafoutis-997a63.netlify.app'];

app.use(
    cors({
        origin: function (origin, callback) {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

mongoose
    .connect(process.env.MONGODB_API)
    .then(() => {
        console.log('DB_Connected');
    })
    .catch(() => {
        console.log('DB Connection failed');
    });

app.post('/login', catchAsyncErrors(async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const userFound = await User.findOne({ username });
        if (!userFound) {
            return res.status(400).json({
                success: false,
                error: 'User Not Found',
            });
        }

        const isPasswordValid = await userFound.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                error: 'Incorrect Password',
            });
        }

        sendToken(userFound, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
}));


app.post('/register', catchAsyncErrors(async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const userFound = await User.findOne({ username });
        if (userFound) {
            return res.status(400).json({
                success: false,
                error: 'User already exists',
            });
        }
        await User.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Registered Successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
}))


app.get(
    "/getUser",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User Not Found',
                });
            }

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
            });
        }
    })
);

app.post(
    "/addTask",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { title, description } = req.body;
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User Not Found',
                });
            }

            user.tasks.push({
                title,
                description,
                completed: false
            });

            await user.save();

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
            });
        }
    })
);

app.get(
    "/getTasks",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User Not Found',
                });
            }

            res.status(200).json({
                success: true,
                tasks: user.tasks,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
            });
        }
    })
);

app.get(
    "/getTasks",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User Not Found',
                });
            }

            res.status(200).json({
                success: true,
                tasks: user.tasks,
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
            });
        }
    })
);

app.get(
    "/getTask/:id",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findOne({ _id: req.user.id });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User Not Found',
                });
            }


            const taskId = req.params.id;
            const task = user.tasks.find((task) => task._id == taskId);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: 'Task Not Found',
                });
            }

            res.status(200).json({
                success: true,
                task,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
            });
        }
    })
);

app.put(
    "/update/:id",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findOne({ _id: req.user.id });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User Not Found',
                });
            }

            const taskId = req.params.id;
            const taskIndex = user.tasks.findIndex((task) => task._id == taskId);

            if (taskIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Task Not Found',
                });
            }

            user.tasks[taskIndex] = {
                ...user.tasks[taskIndex],
                ...req.body,
            };

            await user.save();

            res.status(200).json({
                success: true,
                task: user.tasks[taskIndex],
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
            });
        }
    })
);

app.put(
    "/completed/:id",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findOne({ _id: req.user.id });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User Not Found',
                });
            }

            const taskId = req.params.id;
            const taskIndex = user.tasks.findIndex((task) => task._id == taskId);

            if (taskIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Task Not Found',
                });
            }

            user.tasks[taskIndex].completed = true;

            await user.save();

            res.status(200).json({
                success: true,
                tasks: user.tasks,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
            });
        }
    })
);


app.delete(
    "/delete/:id",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findOne({ _id: req.user.id });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User Not Found',
                });
            }

            const taskId = req.params.id;
            const taskIndex = user.tasks.findIndex((task) => task._id == taskId);

            if (taskIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Task Not Found',
                });
            }

            user.tasks.splice(taskIndex, 1);

            await user.save();

            res.status(200).json({
                success: true,
                message: 'Task deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
            });
        }
    })
);







app.listen(8000, () => {
    console.log('Server started');
});
