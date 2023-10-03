const RegisteringModel = require('../models/registering_model');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function createUser(req, res) {
    const { name, email, password } = req.body;
    try {
        const existingUser = await RegisteringModel.findOne({ email: email });
        if (existingUser) {
            return res.status(409).send({ errorMessage: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new RegisteringModel({
            name: name,
            email: email,
            password: hashedPassword
        });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        res.status(201).send({ token: token, name: user.name });
    } catch (error) {
        console.error(error);
        res.status(500).send({ errorMessage: 'Error registering user' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await RegisteringModel.findOne({ email: email });
        if (!user) {
            return res.status(401).send({ errorMessage: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ errorMessage: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        res.status(200).send({ token: token, name: user.name });
    } catch (error) {
        console.error(error);
        res.status(500).send({ errorMessage: 'Error logging in' });
    }
}


module.exports = { createUser, login };