var mongoose = require('mongoose')

var databaseSchema = new mongoose.Schema({
  databaseName: String,
  databaseCategory: String,
  accession: String,
  databaseUrl: String
})

module.exports = mongoose.model('Database', databaseSchema)
