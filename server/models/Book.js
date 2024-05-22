const { Schema } = require('mongoose');

// Subdocument schema used for the User's `savedBooks` array in User.js
const bookSchema = new Schema({
    // saved book id from GoogleBooks
    bookId: {
        type: String,
        required: true,
    },
    authors: [
        {
            type: String,
        },
    ],
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    // Google pay link to buy book
    buyLink: {
        type: String,
    },
    // Link to see more details about book if buyLink unavailable
    seeMoreLink: {
        type: String,
    }
});

module.exports = bookSchema;
