const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    word: String,
    translation: String,
    wordId: Number,
    meaning: String,
});

const languageSchema = new mongoose.Schema({
    code: String,
    name: String,
    content: [contentSchema],
    languageId: Number
});

// Compile the schema into a model
const Language = mongoose.model('Language', languageSchema);

module.exports = Language;