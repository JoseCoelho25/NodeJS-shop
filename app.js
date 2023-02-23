const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://jose:zemaior25@cluster0.hz58fyg.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();
app.use(flash());

const fileStorage = multer.diskStorage({ //setting up data from uploaded files on form input
    destination:(req, file, cb) => { //creates a file
        cb(null, 'images');
    },
    filename:(req, file, cb) => { //hashes the image
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});


app.set('view engine', 'ejs')
app.set('views', 'views');


const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const authRoutes = require('./routes/auth.js');

app.use(multer({storage: fileStorage}).single('image')); //multer to allow upload image formats
app.use(bodyParser.urlencoded({extended:false})); //to submit text - url encoded
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
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req, res, next) => {  
    //return new Error('Dummy);  to simulate a error on login to display code500
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user) {
                return next();
            }
        req.user = user;
        next();
        })
        .catch(err => {
            next(new Error(err));
        });
    });


app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404)

app.use((error, req, res, next) => { //express has this 4th parameter - error, that ignores its middleware position. When it catches a .catch with an throw(error) inside, it gives priority to that over every middleware.
    //res.redirect('/500');
    // res.status(error.httpStatusCode).render(...);
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
})

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