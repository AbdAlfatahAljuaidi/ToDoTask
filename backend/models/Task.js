const mongoose = require ('mongoose')
const User = require('../models/User')

const taskSchema = new mongoose.Schema({
    taskTitle:{
        type:String,

    },
    taskDescription:{
        type:String,

    },
    priority:{
        type:String,
    },
    status:{
        type:String,
    },
    
    startDate:{
        type:Date,

    },
    dueDate:{
        type:Date,

    },
    checkList:[
        {
          title:{  type: [String]},
done:{type:Boolean,default:false}
        }
    ],
    userId:{
type:mongoose.Types.ObjectId,
ref:User,

    }
    
},{timestamps:true})

module.exports = mongoose.model('Task' , taskSchema)