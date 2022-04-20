const express = require("express");
const route = express.Router();

const userController = require("../controllers/user")

route.post('/users/signin',userController.login);


module.exports = route;