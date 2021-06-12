const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");
const EmailError = require("../errors/email-error");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Неправильный формат почты",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new EmailError("Неправильные почта или пароль");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new EmailError("Неправильные почта или пароль");
        }
        return user;
      });
    });
};

const User = mongoose.model("User", userSchema);

User.createIndexes();

module.exports = User;
