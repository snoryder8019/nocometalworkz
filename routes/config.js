import express from "express";
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
/* GET users listing. */
const config = {
    "title":"nocometalworkz",
"DB_NAME": process.env.DB_NAME,
"DB_URL":process.env.DB_URL,

    "debug":{
        "index":false,
        "scripts":false
    },
    "pause":{

    }

}

export default(config);
