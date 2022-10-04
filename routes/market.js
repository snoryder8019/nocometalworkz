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
   console.log(cart.cart)
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
      const catagory = await client.db(dbName).collection('nm_catagories').find().toArray();
      const responses= req.url.slice(req.url.trim().indexOf('=')+1);
      const data = await client.db(dbName).collection('nm_inventory').find({"catRef":responses}).toArray();
      console.log(data+'\n'+responses)
      const user= req.user
  res.render('marketOp',{title:"filtered: "+responses,user:user, catagory:catagory, data:data,session:req.session})
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
      const newID =ObjectId(req.params._id);
       const data = await client.db(dbName).collection('nm_inventory').findOne({"_id":newID});
  const user= req.user
  res.render('productID',{title:"Product Page",user:user, data:data,session:req.session})
}})

router.post('/addToCart',(req,res)=>{
/////////
async function gettingCart(){
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

await client.db(dbName).collection('users').updateOne(
        {"_id":newID},{
        $push:{ cart:{
        $nm_inventory :  prodId}
        }
});
////////
 res.redirect(req.get('referrer'));
}}
)
  
module.exports = router;