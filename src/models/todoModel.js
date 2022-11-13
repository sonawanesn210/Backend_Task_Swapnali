const mongoose = require("mongoose");
const objectId= mongoose.Schema.Types.ObjectId
const todoSchema = new mongoose.Schema({
    userId:{
        type:objectId,
        ref:'todouser',
        required:true,
        trim:true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        
    },

    date:{
        type:String,
        trim:true

    },
    isDeleted:{
        type:Boolean,
        default:false,
        trim :true
    },
    deletedAt: {
        type: Date,
    },
},
{ timestamps: true }
)

module.exports=mongoose.model('backend_task_Swapnali',todoSchema)