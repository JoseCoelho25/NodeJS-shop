const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://jose:zemaior25@cluster0.hz58fyg.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();


app.set('view engine', 'ejs')
app.set('views', 'views');


const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const authRoutes = require('./routes/auth.js');


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false, 
        store: store
    }));

app.use(csrfProtection);

 app.use((req, res, next) => {  
    if (!req.session.user) {
        return next();
      }
      User.findById(req.session.user._id)
        .then(user => {
          req.user = user;
          next();
        })
        .catch(err => console.log(err));
    });

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404)

// Set the 'strictQuery' option to 'false' to avoid deprecation warning
mongoose.set('strictQuery', false);


mongoose
.connect(MONGODB_URI)
.then(result => {
    // User.findOne().then(user => {
    //     if (!user) {
    //         const user = new User({
    //             name: 'José',
    //             email: 'teste@gmail.com',
    //             cart: {
    //                 items: []
    //             }
    //         });
    //         user.save();
    //     }
    // });
    app.listen(4000);
}).catch(err => {
    console.log(err);
})