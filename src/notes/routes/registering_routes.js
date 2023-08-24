const { Router } = require("express");
const { createUser, login } = require("../controllers/registering_controller");

const registering_router = Router();
registering_router.post('/signUp', createUser);
registering_router.post('/login', login);
module.exports = registering_router;
