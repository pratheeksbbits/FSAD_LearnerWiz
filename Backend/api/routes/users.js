const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose = require('mongoose');
const users = require('../../controllers/users');
const catchAsync = require('../../utils/catchAsync');
const passport = require('passport');
require('dotenv').config();

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.route('/logout')
    .get(users.logout)

module.exports = router;