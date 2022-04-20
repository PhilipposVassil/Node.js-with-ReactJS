const express = require("express");
const route = express.Router();

const userController = require("../controllers/user")
const verifyController = require("../controllers/verifyToken")
const middleware = require("../controllers/middleware")

const authMiddleware = middleware.auth;

route.post('/verifyToken', verifyController.verifyToken);
route.post('/users/signin',userController.login);
route.post('/users/logout',userController.logout);
route.get('/users/getList',authMiddleware,userController.getList);

module.exports = route;