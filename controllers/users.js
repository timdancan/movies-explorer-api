const User = require("../models/user");

exports.getUserInfo = async (req, res, next) => {
  try {
    const userId = await User.findById(req.user._id);
    const { email, name } = userId;
    if (!userId) {
      throw new Error('карточка или пользователь не найден');
    }
    res.send(email, name);
  } catch (e) {
    if (e.name === "CastError") {
      throw new Error('Переданы некорректные данные');
    } else {
      next(e);
    }
  }
};

exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error('карточка или пользователь не найден');
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new Error('Переданы некорректные данные');
      }
      next(err);
    });
};
