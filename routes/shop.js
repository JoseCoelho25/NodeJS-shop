const path=require('path');

const express = require('express');

const rootDir = require('../util/path.js');
const adminData = require('./admin');    //<== we import the admin so we can use the products array to display data received

const router = express.Router();

router.get('/',(req, res, next)=>{
    const products = adminData.products;
    res.render('shop', {
        prods: products, 
        pageTitle: 'Shop', 
        path:'/', 
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        //layout: false  <== special key recognized by handlebars that allows to ignore the main layout
    });  //<== this allows to display the shop.pug html. No need to add another path since we already in the views folder and we declared that in the app.js

    //console.log('shop.js',adminData.products);  //<== here we can display the data received by our input.
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;