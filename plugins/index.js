import express from 'express';
import { connect } from './mongo/mongo.js';

import { oauthCallbackHandler, emailOutGeneral } from './nodemailer/setup.js';

import { router as passportRouter } from './passport/localStrat.js';

const router = express.Router();

connect().catch((err) => console.error('Failed to connect to MongoDB:', err));

router.post('/emailOutGeneral', emailOutGeneral);


router.get('/oauth/callback', oauthCallbackHandler);


router.use(passportRouter);

export default router;