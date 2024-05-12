const express = require('express');
const router = express.Router();
const UserLanguageMapping = require("../models/user_language_mapping")
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const userMappings = await UserLanguageMapping.find({});
    res.status(200).json(userMappings);
});

module.exports = router;