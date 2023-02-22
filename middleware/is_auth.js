module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
      }
      next();
}
//middleware for securing routes so users cant access directly from directory