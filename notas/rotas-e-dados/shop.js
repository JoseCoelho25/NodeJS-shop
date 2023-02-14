const path=require('path');

const express = require('express');

const rootDir = require('../../util/path.js');
const adminData = require('../admin');    //<== we import the admin so we can use the products array to display data received

const router = express.Router();

router.get('/',(req, res, next)=>{
    console.log('shop.js',adminData.products);  //<== here we can display the data received by our input.
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;