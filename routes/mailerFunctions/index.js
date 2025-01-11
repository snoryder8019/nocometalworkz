import express from 'express';
const router =express.Router()
import config from '../config.js'
import { contactFormEmail } from '../../plugins/nodemailer/setup.js';


router.post('/contactForm', async (req, res) => {
    try {
      console.log(req.body);
      await contactFormEmail(req.body);
      res.render('index', { config: config, message: 'Contact form submitted successfully!' });
    } catch (error) {
      console.error('Error handling contact form:', error);
      res.status(500).render('index', { config: config, error: 'Failed to send contact form. Please try again.' });
    }
  });
  


export default router;