const jwt = require("jsonwebtoken");
exports.getToken = function (info) {
  return jwt.sign(info, process.env.SECRET_JWT, {
    expiresIn: 10000,
  });
};
exports.verifyToken = function (token) {
  return jwt.verify(token, process.env.SECRET_JWT, function (err, decoded) {
    if (err) return { error: "Token vencido o invalido" };
    else return decoded;
  });
};
