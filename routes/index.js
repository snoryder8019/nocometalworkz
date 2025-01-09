import express from 'express';
const router = express.Router();
import config from './config.js'
import pluginsRouter from '../plugins/index.js'
/* GET home page. */
router.use(pluginsRouter)
router.get('/', function(req, res, next) {
  res.render('index', {config:config});
});

export default(router);
