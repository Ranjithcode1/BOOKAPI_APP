const mongoose = require('mongoose');

// publication Schema

const PublicationSchema = mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: String,
    books: [String],
});

// publication model

const PublicationModel = mongoose.model('publications', PublicationSchema);

module.exports = PublicationModel;