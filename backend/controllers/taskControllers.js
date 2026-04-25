const db = require('../config/firestore');
const jwt = require('jsonwebtoken');

const CreateTask = async (req, res) => {
  try {
   const { taskTitle, taskDescription, priority, startDate, dueDate, checkList } = req.body;
  
   const token = req.cookies.token;
   if (!token) {
     return res.status(401).json({ error: true, message: "Unauthorized" });
   }
  
   let decoded;
   try {
     decoded = jwt.verify(token, process.env.JWT_SECRET);
   } catch (err) {
     return res.status(401).json({ error: true, message: "Invalid token" });
   }
  
   const userId = decoded.id;
  
   const task = {
     taskTitle,
     taskDescription,
     priority,
     status: "Pending",
     startDate,
     dueDate,
     checkList,
     userId,
     createdAt: new Date()
   };
  
   const doc = await db.collection('tasks').add(task);
  
   return res.status(200).json({
     error: false,
     id: doc.id,
     task
   });
  
  } catch (error) {
   console.log(error);
   return res.status(500).json({ error: "Internal server error" });
  }
  };

  const showTasks = async (req, res) => {
    try {
     const token = req.cookies.token;
     if (!token) {
       return res.status(401).json({ error: true });
     }
    
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const userId = decoded.id;
    
     const snapshot = await db.collection('tasks')
       .where('userId','==',userId)
       .get();
    
     const tasks = snapshot.docs.map(doc => ({
       id: doc.id,
       ...doc.data()
     }));
    
     return res.status(200).json({
       error: false,
       tasks
     });
    
    } catch (error) {
     console.log(error);
     return res.status(500).json({ error: true });
    }
    };
    const showMyTask = async (req,res)=>{
      try {
       const { id } = req.params;
      
       const doc = await db.collection('tasks').doc(id).get();
      
       if(!doc.exists){
         return res.status(404).json({error:true});
       }
      
       return res.status(200).json({
         error:false,
         task: { id: doc.id, ...doc.data() }
       });
      
      } catch(error){
       console.log(error);
       return res.status(500).json({error:true});
      }
      }
      const updateTask = async (req,res)=>{
        try {
         const { id } = req.params;
         const { taskTitle, taskDescription, priority, dueDate, startDate, checkList } = req.body;
        
         const docRef = db.collection('tasks').doc(id);
         const doc = await docRef.get();
        
         if(!doc.exists){
           return res.status(404).json({error:true});
         }
        
         let status = "Pending";
        
         if (Array.isArray(checkList) && checkList.length > 0) {
           const allDone = checkList.every(i => i.done === true);
           const noneDone = checkList.every(i => i.done === false);
        
           if(allDone) status = "Completed";
           else if(noneDone) status = "Pending";
           else status = "In Progress";
         }
        
         await docRef.update({
           taskTitle,
           taskDescription,
           priority,
           dueDate,
           startDate,
           checkList,
           status
         });
        
         return res.status(200).json({
           error:false,
           message:"Task updated"
         });
        
        } catch(error){
         console.log(error);
         return res.status(500).json({error:true});
        }
        }
 



module.exports= {
    CreateTask,
    showTasks,
    showMyTask,
    updateTask
}

