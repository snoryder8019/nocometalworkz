import express from 'express';
const router = express.Router();
import config from './config.js'
import pluginsRouter from '../plugins/index.js'
import mailerRouter from './mailerFunctions/index.js'
import { fetchGalleryImages } from '../plugins/aws_sdk/setup.js';
/* GET home page. */
router.use(pluginsRouter)
router.use(mailerRouter)
router.get('/',async(req, res, next)=>{
  try{
  const galleryImages = await fetchGalleryImages();
  console.log(galleryImages)
  res.render('index', {config:config, galleryImages});
  }
  catch(error){console.error(error)}
});

export default(router);
