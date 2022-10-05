var express = require('express');
var router = express.Router();
const { MongoClient} = require('mongodb');

var client = require('../config/mongo');
const alert = require('alert')
const app = express();
const ObjectId = require('mongodb').ObjectId;
const dbName = 'nocoMetal'
const admin = require('./auth/admin');
const { ensureAuth, ensureGuest} = require('../middleware/auth')
/* GET home page. */
router.get('/',(req, res, next)=> {
  async function gettingBlogs(){
    try {
     await client.connect();
     await getBlogs(client);
    }
    catch(err){
      console.log(err)
    }
    finally{
    await client.close();
  }}
  gettingBlogs().catch(console.error);
  async function getBlogs(client){
const user= req.user
    const blogs = await client.db(dbName).collection('blogs').find().toArray();
    const data = await client.db(dbName).collection('nm_inventory').find().toArray();
    if(user){
    const cart = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.user._id)});
            //////total cart items
            const cartArray = []
            var cartTotal=0;
     
            function cartGather(){
             for (i=0;i<cart.cart.length;i++){
                 cartArray.push(parseInt(cart.cart[i].price))
                 cartTotal +=cartArray[i]
             }
           }
             cartGather()
                    console.log(cartTotal)
             console.log(cartArray)
          ////END CART TOTALS
    res.render('index', {title:'Welcome',cartTotal:cartTotal,cart:cart,user:user, data:data, blogs:blogs,session:req.session})
  }else{
      res.render('index', {title:'Welcome',user:user, data:data, blogs:blogs,session:req.session})

    }
    }
});

module.exports = router;
