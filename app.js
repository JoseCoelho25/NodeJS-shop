const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();


app.set('view engine', 'ejs')
app.set('views', 'views');


const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const authRoutes = require('./routes/auth.js');


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

 app.use((req, res, next) => {  //to find userById
     User.findById('63f162e7372ded7a1d9c0f0d')
     .then(user => {
         req.user = user; 
         next();
     })
     .catch(err => console.log(err));
 });

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404)

// Set the 'strictQuery' option to 'false' to avoid deprecation warning
mongoose.set('strictQuery', false);


mongoose.connect('mongodb+srv://jose:zemaior25@cluster0.hz58fyg.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                name: 'José',
                email: 'teste@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    });
    app.listen(4000);
}).catch(err => {
    console.log(err);
})