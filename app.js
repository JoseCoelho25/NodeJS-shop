const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');  //<== this setup allows me to use template engines installed by me, to help me use data
//app.set('views','template');  <== i can put the html files i create in witchever file i decide to name, but i need to define that in my main.js with this app.set

const adminData = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js')


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use((req,res,next)=>{
    res.status(404).render('404', {pageTitle:'Page Not Found'})
    //res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})


app.listen(3000);