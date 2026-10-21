const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Now req.user is available in the route
    } catch (err) {
      console.log("Token invalid, proceeding as guest.");
    }
  }
  next(); // Continue even if no token is found
};