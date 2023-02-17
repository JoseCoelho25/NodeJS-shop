const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//const expressHbs = require('express-handlebars'); <== import handlebars extension

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

//app.engine('handlebars', expressHbs({layoutDir: 'views/layouts', defaultLayout:'main-layout', extname: 'handlebars'})); <== setup engine for handlebars
app.set('view engine', 'ejs')
app.set('views', 'views');
//app.set('view engine', 'pug');  //<== this setup allows me to use template engines installed by me, to help me use data
//app.set('views','template');  <== i can put the html files i create in witchever file i decide to name, but i need to define that in my main.js with this app.set

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js')


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    next();
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)


app.listen(3000);

mongoConnect(() => {
    app.listen(4000);
});