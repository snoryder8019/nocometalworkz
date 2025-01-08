import express from 'express';
const router = express.Router();
import config from './config.js'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {config:config});
});

export default(router);
