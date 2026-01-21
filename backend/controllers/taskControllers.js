const Task = require("../models/Task")
const mongoose = require('mongoose');
const task = require("../routes/task");
const jwt = require('jsonwebtoken');


const CreateTask = async (req, res) => {
  try {
    const { taskTitle, taskDescription, priority, startDate, dueDate, checkList } = req.body;
    console.log("hello1");
    

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: true, message: "Unauthorized: No token provided" });
    }
    console.log("hello434",token);
    console.log("hello22");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: true, message: "Unauthorized: Invalid token" });
    }

    // هنا نأخذ userId من التوكن المفكوك
    const userId = decoded._id || decoded.id;
    console.log("userId", userId);

    const task = new Task({
      taskTitle,
      taskDescription,
      priority,
      status: "Pending",
      startDate,
      dueDate,
      checkList,
      userId
    });

    await task.save();

    return res.status(200).json({ error: false });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const showTasks = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: true, message: "Unauthorized: No token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: true, message: "Invalid token" });
    }

    const userId = decoded._id || decoded.id;

    const tasks = await Task.find({ userId });
    console.log("Found tasks:", tasks);

    return res.status(200).json({ error: false, message: "Tasks fetched successfully", tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
};


const showMyTask = async (req,res) => {
  try{
    const {id} = req.params
  const MyTask = await Task.findById(id)
  if(!MyTask){
return res.status(401).json({error:true,error:"Faield To get Task"})
  }

  return res.status(200).json({error:false,message:"The task has been called successfully",task:MyTask})
  }catch(error){
    console.log(error);
    return res.status(500).json({error:true,message:"Internal server error"})
    
  }


}

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskTitle, taskDescription, priority, dueDate, startDate, checkList } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(401).json({ error: true, message: "There is no task" });
    }

    // ✅ تحليل حالة الـ checklist
    let status = "Pending"; // الحالة الافتراضية

    if (Array.isArray(checkList) && checkList.length > 0) {
      const allDone = checkList.every(item => item.done === true);
      const noneDone = checkList.every(item => item.done === false);

      if (allDone) {
        status = "Completed";
      } else if (noneDone) {
        status = "Pending";
      } else {
        status = "In Progress";
      }
    }

    // ✅ التحديث مع الحالة الجديدة
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        taskTitle,
        taskDescription,
        priority,
        dueDate,
        startDate,
        checkList,
        status // ⬅️ نضيف الحالة المحسوبة هنا
      },
      { new: true }
    );

    return res.status(200).json({ error: false, message: "Task updated" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Server error" });
  }
};

 



module.exports= {
    CreateTask,
    showTasks,
    showMyTask,
    updateTask
}

