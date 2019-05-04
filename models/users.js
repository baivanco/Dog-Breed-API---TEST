var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  type: String,
  created_at: Date
})

userSchema.pre('save', function (next) {
  var currentDate = new Date();
  this.created_at = currentDate;
  next()
})


var User = mongoose.model('User', userSchema)

module.exports = {
  User
}