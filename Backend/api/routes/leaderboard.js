const express = require('express');
const router = express.Router();
const UserLanguageMapping = require("../models/user_language_mapping")
const Language = require('../models/language');
const mongoose = require('mongoose');
const { isLoggedIn } = require('../../middleware');

router.get('/', isLoggedIn, async (req, res) => {
    try {
        const userMappings = await UserLanguageMapping.find({});
        const languages = await Language.find({}, {languageId: 1, name: 1});
    
        const finalRes = {};
        const finalResSorted = {};
    
        userMappings.forEach((mapping) => {
            const { languageId, username } = mapping;
    
            if (!finalRes[languageId]) {
                finalRes[languageId] = {};
            }
    
            if (!finalRes[languageId][username]) {
                finalRes[languageId][username] = 0;
            }
    
            finalRes[languageId][username] += 1;
        });
    
        for (var languageId in finalRes) {
            let sort_user_prog = [];
            
            for (var username in finalRes[languageId]) {
                sort_user_prog.push([finalRes[languageId][username], username]);
            }
            
            sort_user_prog.sort((a, b) => {
                return b[0] - a[0];
            });
            
            sort_user_prog.forEach((item) => {
                if (!finalResSorted[languageId]) {
                    finalResSorted[languageId] = {};
                }
                
                finalResSorted[languageId][item[1]] = item[0];
            });
        }
    
        const response = [];
    
        languages.forEach((language) => {
            const { languageId, name } = language;
            const langData = {
                languageId,
                name,
                'ranking': finalResSorted[languageId]
            };
            
            response.push(langData);
        });
    
        //res.status(200).json(response);
        res.render('leaderboard', { response: response });
    } catch (error) {
        console.error('Encountered error while fetching Leaderboard details!');
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;