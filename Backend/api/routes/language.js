const express = require("express");
const router = express.Router();
const Language = require("../models/language");
const UserLanguageMapping = require("../models/user_language_mapping")
const mongoose = require('mongoose');
const { isLoggedIn } = require('../../middleware');

// User registration endpoint
router.get('/content/:languageId', isLoggedIn, async (req, res) => {
    const languageId = Number(req.params.languageId);
    const username = req.user.username;

    try {
        const languageData = await Language.find({languageId});
        const wordList = (await UserLanguageMapping.find({ username, languageId })).map(x => x.wordId);
        let response = {
            code: languageData[0].code,
            languageId: languageData[0].languageId,
            name: languageData[0].name,
            content: languageData[0]?.content.map(word => {
            return {
                wordId: word.wordId,
                word: word.word,
                translation: word.translation,
                meaning: word.meaning,
                progress: wordList.includes(word.wordId) ? 1 : 0,
            };
        })};

        // res.status(200).json(response);
        res.render('language', { response: response });
    } catch (error) {
        console.error('Error fetching language content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/content/:languageId/:wordId', isLoggedIn, async (req, res) => {
    const languageId = req.params.languageId;
    const wordId = req.params.wordId;
    const username = req.user.username;

    try {
        const completedWord = new UserLanguageMapping({
            _id: new mongoose.Types.ObjectId(),
            username,
            languageId,
            wordId
        });

        await completedWord.save();
        res.redirect(`/language/content/${languageId}`);
        // res.status(201).json({ message: 'Word Completed Successfully!' });
    } catch (error) {
        console.error('Error in completion: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;