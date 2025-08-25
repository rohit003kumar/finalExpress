const express = require("express");
const {isAuth} = require('../middleware/isAuth')
const {getCurrentUser,updateUser, deleteUser, getAllCustomers} = require("../controllers/user.controller");

let userRoute = express.Router();

userRoute.get("/currentuser",isAuth,getCurrentUser)
userRoute.put("/:id",isAuth,updateUser)
userRoute.delete("/:id",isAuth,deleteUser)
userRoute.get("/", getAllCustomers);
module.exports = userRoute;