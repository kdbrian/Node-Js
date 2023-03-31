const express = require("express");
const { getAll, create, update, getbyId, deleteUser, login, deleteAll, logout, getUserByUserName} = require("../controllers/usercontroller");
const { protect, restrictTo} = require('./../utils/protectRestrict')
const Router  = express.Router();

Router.
        get('/', getAll)// protect, restrictTo('admin'),
        .post('/new', protect, restrictTo('admin'), create)
        .patch('/:id/update', protect, restrictTo('admin'), update)
        .get('/:id', protect, restrictTo('admin'),getbyId)
        .delete('/delete/all', protect, restrictTo('admin'), deleteAll)
        // .get('/:username',protect, restrictTo('admin'), getUserByUserName)
        .delete('/delete/:id', protect, restrictTo('admin'), deleteUser)

        .post('/auth/login', login)
        .get('/auth/logout', protect, logout)
        .post('/auth/register', create)
        .get('/auth/:username',protect, getUserByUserName)


module.exports = Router;