var express = require('express');
var router = express.Router();
const { MongoClient} = require('mongodb');
var client = require('../config/mongo');
const alert = require('alert')
const app = express();
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
    res.render('index', {title:'Welcome',user:user, data:data, blogs:blogs,session:req.session})
    }
});

module.exports = router;
