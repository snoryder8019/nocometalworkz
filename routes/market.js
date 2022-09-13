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
  const catagory = await client.db(dbName).collection('nm_catagories').find().toArray();
  const data = await client.db(dbName).collection('nm_inventory').find().toArray();
   res.render('market', {title:"Our Designs", data:data, catagory:catagory})

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
      console.log(data)
  res.render('marketOp',{title:"filtered: "+responses, catagory:catagory, data:data})
}})

module.exports = router;