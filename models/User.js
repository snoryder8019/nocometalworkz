const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId:{
        type: String,
        required : false,
            },
            facebookId:{
                type: String,
                required : false,
                    },
            email:{
                type:String,
                required:true,
            },
    displayName:{
        type: String,
        required : false,
            },
    firstName:{
        type: String,
       required : false,
            },
    lastName:{
        type: String,
        required : false,
            },
    image:{
        type: String,
                    },
      isAdmin:{
        type:Boolean,
        default:false,
        required:true
    },
    cart:{
        type:Array
    },
     createdAt:{
         type:Date,
         default:Date.now
            }
})
module.exports =  mongoose.model('User',UserSchema)