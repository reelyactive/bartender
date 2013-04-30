var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
  uuid: String,
  mac: String,
  vendor: String,
  type: String,
  model: String,
  radioProtocol: String
});

var Tag = null;

module.exports = function(db) {
  if(db && Tag === null) {
    Tag = db.model('Tag', tagSchema);
  }
  return Tag;
};