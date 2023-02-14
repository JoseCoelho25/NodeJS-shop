const path = require('path');

const express = require('express');

const rootDir = require('../util/path.js');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product',(req, res, next)=>{
    res.render('add-product', {pageTitle: 'Products Page', path: 'admin/add-product'})
    //res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
});

// /admin/add-product => POST
router.post('/add-product',(req,res,next)=>{
    //console.log(req.body.title) //<= this sends the value of the input the user has selected,req.body gives me an object, with the key defined as title, because we decided that in the input html      if i do req.body.title i get the value placed inside the body of the input as a string
    products.push({title: req.body.title});
    res.redirect('/');
})

exports.routes = router;
exports.products = products;