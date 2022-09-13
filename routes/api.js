const express = require('express')
const router = express.Router();

router.get ('/outbound/', (req,res)=>{
    const resultsd = 3;
    res.sendStatus(resultsd);
})


module.exports = router