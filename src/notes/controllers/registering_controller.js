const RegisteringModel = require('../models/registering_model');
const bcrypt = require('bcrypt');

async function createUser(req, res) {
    const { name, email, password } = req.body;
    try {
        // console.log(req.body)
        // Check if user with the same email already exists
        const existingUser = await RegisteringModel.findOne({ email: email });
        if (existingUser) {
            return res.status(409).send({ errorMessage: 'Email already exists' });

        }
        // Hash the password before saving the user to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new RegisteringModel({

            name: name,
            email: email,
            password: hashedPassword
        });
        await user.save();
        const userData = await RegisteringModel.findOne({ password: hashedPassword })
        console.log(userData)
        res.status(201).send({ token: userData._id, name: userData.name });
    } catch (error) {
        console.error(error);
        res.status(500).send({ errorMessage: 'Error registering user' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    console.log(email)
    try {
        // Find the user with the provided email
        const user = await RegisteringModel.findOne({ email: email });
        // console.log(user)
        if (!user) {
            return res.status(401).send({ errorMessage: 'Invalid email or password' });
        }
        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ errorMessage: 'Invalid email or password' });
        }
        const loginData = { token: user._id, name: user.name }
        res.status(200).send(loginData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ errorMessage: 'Error logging in' });
    }
}

module.exports = { createUser, login };