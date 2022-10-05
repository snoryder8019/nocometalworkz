const express = require('express');
const router = express.Router();
const { MongoClient} = require('mongodb');
const client = require('../config/mongo');
const alert = require('alert');
const dbName= 'nocoMetal';
const imageFP = 'MEVNmarketV1'
const cookieParser = require('cookie-parser');
const fs = require('fs');
const multer = require('multer');
const { getEnabledCategories } = require('trace_events');
const upload =multer({dest:"uploads/"});
const path =require('path');
const { stringify } = require('querystring');
const { get } = require('http');
const { escapeRegExpChars } = require('ejs/lib/utils');
const ObjectId = require('mongodb').ObjectId;
//////////////////middleware
router.use((req,res,next)=>{
  res.locals.user = req.session.user
next();
})
////////////////////////////////////

router.get('/market', (req,res) =>{
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
  //calling the function
  gettingBlogs().catch(console.error);
  async function getBlogs(client){
 const user = req.user
  const catagory = await client.db(dbName).collection('nm_catagories').find().toArray();
  const data = await client.db(dbName).collection('nm_inventory').find().toArray();
if(user){
  const cart = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.user._id)});
   res.render('market', {title:"Our Designs",cart:cart,user:user, data:data, catagory:catagory, session:req.session})
  }else{
    res.render('market', {title:"Our Designs",user:user, data:data, catagory:catagory, session:req.session})

  }
  }

   }
)
router.get('/marketOp', (req,res)=>{
 
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
    //calling the function
    gettingBlogs().catch(console.error);
    async function getBlogs(client){
      const user= req.user
      const catagory = await client.db(dbName).collection('nm_catagories').find().toArray();
      const responses= req.url.slice(req.url.trim().indexOf('=')+1);
      const data = await client.db(dbName).collection('nm_inventory').find({"catRef":responses}).toArray();
      if(user){
        const cart = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.user._id)});
        const cartItemsID = [];
        for(let i =0;i<cart.cart.length;i++){
          let pushItem = [
            cart.cart[i].$nm_inventory
          ]
          cartItemsID.push(pushItem)
          
        }
        
        
     

        
         res.render('marketOp',{title:"filtered: "+responses,user:user,cart:cart ,catagory:catagory, data:data,session:req.session})
        }else{
      res.render('marketOp',{title:"filtered: "+responses,user:user, catagory:catagory, data:data,session:req.session})

    }
        }})


router.get('/productID/:_id', (req,res)=>{
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
      const newID =ObjectId(req.params._id);
       const data = await client.db(dbName).collection('nm_inventory').findOne({"_id":newID});
       if(user){
         const cart = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.user._id)});
         res.render('productID',{title:"Product Page" ,cart:cart,user:user, data:data,session:req.session})
        }else{
          res.render('productID',{title:"Product Page" ,user:user, data:data,session:req.session})
          
        }
      }})
      
      router.post('/addToCart',(req,res)=>{
        /////////
        async function gettingCart(data){
  const user= req.user
  try {
    await client.connect();
    await getCart(client);
  }
  catch(err){
    console.log(err)
  }
  finally{
    await client.close();
  }}
  gettingCart().catch(console.error);
  
  async function getCart(client){
    const user = req.user

    const prodId = ObjectId(req.body.prodId)
    const newID =ObjectId(user.id);
    // const data = await client.db(dbName).collection('nm_inventory').findOne({"_id":newID});
    
    await client.db(dbName).collection('users').updateOne(
      {"_id":newID},{
        $push:{ cart:{
          nm_inventory :  prodId,
          price:req.body.prodPrice,
          name:req.body.prodName,
          img:req.body.prodImg}
        }
});
////////
 res.redirect(req.get('referrer'));
}}
)
 

//////DELETE CART ITEM **Stable 10-5-22
router.post('/delCart',(req,res)=>{
  async function deleteCart(){
    try{
      await client.connect();
      await getCart(client);  
    }
    catch(err){
      console.log("error"+err);
    }
    finally{
      await client.close();
    }
  }
  deleteCart().catch(console.error);
  async function getCart(client){
    const newID =req.body.delCart;
    const newCart =ObjectId(req.body.cartID);
   // const cartFind =await client.db(dbName).collection('users').findOne({"_id":newCart});
    const cartFind = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.user._id)});
    const delItem = await client.db(dbName).collection('users').updateOne(
      {"_id":ObjectId(req.user._id)},
      {$pull:{"cart":{"name":req.body.cartNum}}});
    //const cart = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.user._id)});
    console.log(req.body.cartNum[0].name)
    console.log(req.body.cartNum)
   console.log(delItem)
    res.redirect(req.get('referrer'));
  }
})
//////////

module.exports = router;