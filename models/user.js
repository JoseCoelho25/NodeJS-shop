const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart = { items: [] }, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();  //allows the connection to the db
        return db.collection('users').insertOne(this);
    }

    //for every user we want a cart, and for every cart we want to have multiple products in a 1:1 relation. So we can achieve this in the user model, without the need to create a cart model.
    addToCart(product) {
        if (!this.cart) {
            this.cart = { items:[]};
        }
        const cartProductIndex = this.cart.items.findIndex(cp =>{
             return cp.productId.toString() === product._id.toString();  //this allows me to find if the product already exists in a cart by its index
         });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items]; //this allows to work on the new array without changing the original

        if(cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity +1; //if product exists in cart, add quantity +1
            updatedCartItems[cartProductIndex].quantity = newQuantity; //i get the existing product by its index and set its quantity to the newQuantity defined by default as 1
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity});
        }
        const updatedCart = {
            items: updatedCartItems
        }
        const db = getDb();
        return db
        .collection('users')
        .updateOne(
            {_id: new ObjectId(this._id)},
            { $set: {cart: updatedCart}}
        )
        .catch(err => {
            console.log(err)
        });
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        })
        return db
        .collection('products')
        .find({_id: { $in: productIds}})
        .toArray()
        .then(products => {
            return products.map(p => {
                return {...p, quantity: this.cart.items.find(i => {
                    return i.productId.toString() === p._id.toString() ;
                }).quantity
            }
            })
        })
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
        .collection('users')
        .updateOne(
            { _id: new ObjectId(this._id) }, 
            { $set: { cart: {items: updatedCartItems}}}
            );
    }

    addOrder() {
        const db = getDb();
         return this.getCart().then(products => { //we use getCart to fetch all the data inside the cart collection already
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.name
                }
            };
            return db.collection('orders').insertOne(order)
        })
        .then(result => {
             this.cart = { items: []};
             return db
             .collection('users')
             .updateOne(
                 { _id: new ObjectId(this._id) }, 
                 { $set: { cart: {items: [] }}}
            );
        });
    }


    static findById(userId) {
        const db = getDb();
        return db
        .collection('users')
        .findOne({_id: new ObjectId(userId)}) //if i use find one i dont to use next()
        .then(user => {
            return user;
        })
        .catch(err => {
            console.log(err);
        })
    }
}


module.exports = User;