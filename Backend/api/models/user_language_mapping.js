const mongoose = require('mongoose');

const userLanguageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    languageId: Number,
    email: String,
    wordId: Number,
});

// Compile the schema into a model
const UserLanguageMapping = mongoose.model('UserLanguageMapping', userLanguageSchema, 'user_language_mapping');

module.exports = UserLanguageMapping;