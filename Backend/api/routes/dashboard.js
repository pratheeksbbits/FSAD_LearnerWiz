const express = require("express");
const router = express.Router();
const Language = require("../models/language");
const UserLanguageMapping = require("../models/user_language_mapping")
const mongoose = require('mongoose');

router.get('/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const languageData = await Language.find();
        const wordList = await UserLanguageMapping.find({ email });
        const data  = languageData.map((value)=>{
            return {
                code: value.code,
                languageId: value.languageId,
                progress: (wordList.filter((word)=> word.languageId == value.languageId).length)/value.content.length,
            }
        })
        // res.status(200).json({data: data});
        res.render('dashboard', { data: data });
    } catch (error) {
        console.error('Error fetching language content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;