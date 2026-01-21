const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
      // المستخدم مسجل دخول
      next();
    } else {
      // المستخدم غير مسجل دخول
      return res.status(401).json({ error: true, message: "Unauthorized. Please log in first." });
    }
  };
  
  module.exports = requireLogin;
  