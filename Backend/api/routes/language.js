const express = require("express");
const router = express.Router();
const Language = require("../models/language");
const UserLanguageMapping = require("../models/user_language_mapping")
const mongoose = require('mongoose');

// User registration endpoint
router.get('/content/:email/:languageId', async (req, res) => {
    const languageId = Number(req.params.languageId);
    const email = req.params.email;
    try {
        const languageData = await Language.find({languageId});
        const wordList = (await UserLanguageMapping.find({ email, languageId })).map(x => x.wordId);
        let response = {
            code: languageData[0].code,
            languageId: languageData[0].languageId,
            content: languageData[0]?.content.map(word => {
            return {
                wordId: word.wordId,
                word: word.word,
                translation: word.translation,
                meaning: word.meaning,
                progress: wordList.includes(word.wordId) ? 1 : 0,
            };
        })};

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching language content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/content/completed/:email', async (req, res) => {
    const email = req.params.email;
    console.log(req.body)
    try {
        const { languageId, wordId } = req.body;
        const wordCompleted = new UserLanguageMapping({
            _id: new mongoose.Types.ObjectId(),
            email,
            languageId,
            wordId
        });
        await wordCompleted.save();

        res.status(201).json({ message: 'Word Completed successfully' });
    } catch (error) {
        console.error('Error in completion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;