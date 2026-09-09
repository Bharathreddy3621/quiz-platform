const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;

    if (!isAdmin) {
      return res.status(403).send({
        message: "You are not authorized",
        success: false,
      });
    }

    req.body.userId = userId;
    next();
  } catch (error) {
    res.status(401).send({
      message: "You are not authenticated",
      data: error,
      success: false,
    });
  }
};
