const express = require('express')
const task= express.Router()
const {CreateTask,showTasks,showMyTask,updateTask} = require('../controllers/taskControllers')
const cookieJwtAuth = require('../middlewares/cookieJwtAuth')


task.post("/CreateTask",CreateTask)
task.post("/showTasks",showTasks)
task.get("/getTask/:id",showMyTask)
task.put("/updateTask/:id",updateTask)

module.exports = task