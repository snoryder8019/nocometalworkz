const express = require('express');
const router = express.Router();
const { MongoClient} = require('mongodb');
const client = require('../../config/mongo');
const alert = require('alert');
const dbName= 'nocoMetal';
const imageFP = 'nocometalworkz'
const cookieParser = require('cookie-parser');
const fs = require('fs');
const multer = require('multer');
const { getEnabledCategories } = require('trace_events');
const upload =multer({dest:"uploads/"});
const path =require('path');
const { userInfo } = require('os');
const { authenticate } = require('passport');
//const passport = require('../../config/passport');
const passport = require('../../config/passport');
const ObjectId = require('mongodb').ObjectId;
//////////////////middleware
router.use((req,res,next)=>{
next();
})
////////////////////////////////////
router.get('/login', function(req, res) {
  const user = req.user
  res.render('login',{user:user});
  }); 
//////////////////////////////////
router.get('/admin', (req,res) =>{
 console.log(req.session.user)
 // const session = req.session.user
  const user = req.user
  if( req.session.user.isAdmin == true){
////
   async function gettingEmails(){
    try {
     await client.connect();
     await getEmails(client);
    }
    catch(err){
      console.log(err);
    }
    finally{
    await client.close();
  }}
  ///////
 gettingEmails().catch(console.error);
  async function getEmails(client){
    const session = req.session.user
    const user = req.user
   const data = await client.db(dbName).collection('registry').find().toArray();
   const blogs= await client.db(dbName).collection('blogs').find().toArray();
   const catagory = await client.db(dbName).collection('nm_catagories').find().toArray();
   const colors = await client.db(dbName).collection('nm_colors').find().toArray();
   if(user){
   res.render('admin', {title:'Admin Page', data:data, blogs:blogs, catagory:catagory, colors:colors, user:user});
  }
  if(req.session.user){
     res.render('admin', {title:'Admin Page', data:session.data, blogs:blogs, catagory:catagory, colors:colors, user:user});

   }
  }
  }else{
    console.log('not finding creds')
  //  res.status(401)
    res.redirect('/login')
  }
  })
//////////////////////////////////
router.get('/inventory', (req,res) =>{
  console.log(req.session.user)
  // const session = req.session.user
   const user = req.user
   if( req.session.user.isAdmin == true){
 ////
    async function gettingEmails(){
     try {
      await client.connect();
      await getEmails(client);
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
   ///////
  gettingEmails().catch(console.error);
   async function getEmails(client){
     const session = req.session.user
     const user = req.user
   // const data = await client.db(dbName).collection('registry').find().toArray();
  //  const blogs= await client.db(dbName).collection('blogs').find().toArray();
    const catagory = await client.db(dbName).collection('nm_catagories').find().toArray();
   // const colors = await client.db(dbName).collection('nm_colors').find().toArray();
    if(user){
    res.render('inventory', {title:'Inventory Page', catagory:catagory,  user:user});
   }
   if(req.session.user){
      res.render('inventory', {title:'Inventory Page', catagory:catagory, user:req.session.user});
 
    }
   }
   }else{
     console.log('not finding creds')
   //  res.status(401)
     res.redirect('/login')
   }
   })

///////////////multer
 router.post('/upload',upload.single('photo'), function(req,res){
  //isolate file extention
  const imageData= req.file;
  const ogStr=0;
  const str = imageData.originalname;
  const str2 = imageData.filename;
  const strSplit= str.split('.');
  const ext = strSplit[1];
  const oldFilepath = "../"+imageFP+"/uploads/";
  const newFilepath = "../"+imageFP+"/public/images/blog/"
  const newName = 'blog_Image_'+ Date.now()+"."+ext;


  const bImgName = "images/blog/"+newName;

  fs.rename(oldFilepath+str2,newFilepath+newName,(err)=>{
if(err){
  console.log(err);
}
 })

  async function saveBlog(bImgName,data){
    try {
      await client.connect();
      await createBlog(client,{
        bTitle:req.body.title,
        postDate:Date.now(),
        bSubtitle:req.body.subtitle,
        bDetails:req.body.details,
        imgName:bImgName
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
 saveBlog(bImgName).catch(console.error);
   async function createBlog(client,newBlog){
    const result = await client.db(dbName).collection('blogs').insertOne(newBlog);
    res.redirect('admin');
    }
   }
)
//////////DELETE BLOGS
router.post('/delBlog',(req,res)=>{
  async function deleteBlog(){
    try{
      await client.connect();
      await getBlog(client);  
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
  }
  deleteBlog().catch(console.error);
  async function getBlog(client){
    const newID =ObjectId(req.body.blogDelete);
  const deleteIt = await client.db(dbName).collection('blogs').deleteOne({"_id":newID});
  const data = await client.db(dbName).collection('registry').find().toArray();
  const blogs= await client.db(dbName).collection('blogs').find().toArray();
  res.redirect('admin');
  }
})
///////////////multer
/////////////INVENTORY UPLOADS
router.post('/newItem',upload.single('photo'), function(req,res){
  //isolate file extention
  const imageData= req.file;
  const ogStr=0;
  const str = imageData.originalname;
  const str2 = imageData.filename;
  const strSplit= str.split('.');
  const ext = strSplit[1];
  const oldFilepath = "../"+imageFP+"/uploads/";
  const newFilepath = "../"+imageFP+"/public/images/inventory/"
  const newName = 'inventory_image_'+ Date.now()+"."+ext;


  const bImgName = "images/inventory/"+newName;

  fs.rename(oldFilepath+str2,newFilepath+newName,(err)=>{
if(err){
  console.log(err);
}
 })
  async function saveBlog(bImgName,data){
    const pplInfo =req.body.paypalcode; 
    console.log(pplInfo);
    try {
      await client.connect();
      await createBlog(client,{
        name:req.body.inventoryName,
        postDate:Date.now(),
        price:req.body.inventoryPrice,
        details:req.body.inventoryDetails,
        catRef:req.body.catSelect,
        imgName:bImgName,
        //paypalRef:req.body.paypalCode
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
 saveBlog(bImgName).catch(console.error);
   async function createBlog(client,newBlog){
    const result = await client.db(dbName).collection('nm_inventory').insertOne(newBlog);
    res.redirect('admin');
    }
   }
)
/////////SAVE COLORS
router.post('/newColor', function(req,res){
  async function saveColor(){
    try {
      await client.connect();
      await createColor(client,{
       postDate:Date.now(),
       colorHex:req.body.clrHex,
      colorTag:req.body.clrTag,
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
 saveColor().catch(console.error);
   async function createColor(client,newColor){
    const result = await client.db(dbName).collection('nm_colors').insertOne(newColor);
    res.redirect('admin');
    }
   }
)

////DELETE COLORS
router.post('/delColor',(req,res)=>{
  async function deleteColor(){
    try{
      await client.connect();
      await getColor(client);  
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
  }
  deleteColor().catch(console.error);
  async function getColor(client){
    const newID =ObjectId(req.body.colorDel);
  const deleteIt = await client.db(dbName).collection('nm_colors').deleteOne({"_id":newID});
return  res.redirect('admin');
  }
})


//////CATEGOREIS
/////////SAVE CATAGORIES
router.post('/newCat', function(req,res){
  async function saveCat(){
    try {
      await client.connect();
      await createCat(client,{
       postDate:Date.now(),
       catName:req.body.catName,
      
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
 saveCat().catch(console.error);
   async function createCat(client,newCat){
    const result = await client.db(dbName).collection('nm_catagories').insertOne(newCat);
  return  res.redirect('admin');
    }
   }
)

////DELETE CATAGORIES
router.post('/delCat',(req,res)=>{
  async function deleteCat(){
    try{
      await client.connect();
      await getCat(client);  
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
  }
  deleteCat().catch(console.error);
  async function getCat(client){
    const newID =ObjectId(req.body.catDel);
    console.log('modded')
 // const deleteIt = await client.db(dbName).collection('nm_catagories').deleteOne({"_id":newID});
 return res.redirect('admin');
  }
})
module.exports = router;