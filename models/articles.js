var mongoose = require('mongoose')

var articlesSchema = new mongoose.Schema({
    title : String,
    url: String,
    authors: [Object],
    abstract: String
})

module.exports = mongoose.model('Articles', articlesSchema)