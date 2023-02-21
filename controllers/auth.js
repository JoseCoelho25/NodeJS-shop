const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req
    //   .get('Cookie')
    //   .split('=')[1]
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false
    });
  };

  exports.postLogin = (req, res, next) => {
    User.findById('63f162e7372ded7a1d9c0f0d')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');  //only after save so it redirect after the session is created and not before
      })
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
};