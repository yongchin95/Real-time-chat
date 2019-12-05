const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
        username: {
            type:String,
            required:true
        },
        content: {
            type:String,
            required:true
        },
        timestamp:{
            type:Number,
            required:true
        }

})
module.exports=mongoose.model("Content", contentSchema); 
