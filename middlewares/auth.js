const jwt = require("jsonwebtoken");
const AuthError = require("../errors/auth-error");

const { JWT_SECRET_KEY = 'secret_key' } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AuthError("необходма авторизация");
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (e) {
    throw new AuthError("Нет доступа");
  }

  req.user = payload;

  return next();
};
