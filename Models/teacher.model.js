const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userAvatarImg: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);