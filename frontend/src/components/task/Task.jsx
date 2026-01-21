'use client'
import React, { useEffect, useState } from 'react'
import Header from '../header/Header'
import Menu from '../menu/Menu'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import { toast } from 'react-toastify'

const Page = () => {

  const [task ,setTask] = useState({})
  
    const [taskTitle, setTitle] = useState(task.taskTitle);
    const [taskDescription, setDescription] = useState("");
    const [priority, setPriority] = useState("Low");
    const [dueDate, setDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [checkList, setChecklist] = useState([]);

    const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

  const params= useParams()
  const id = params.id

  
  useEffect(() => {
    async function getTask() {
      try {
        const { data } = await axios.get(`${apiUrl}/getTask/${id}`);
    
        if (data.error === false) {
          const taskData = data.task;
          setTask(taskData);
          setTitle(taskData.taskTitle || '');
          setDescription(taskData.taskDescription || '');
          setPriority(taskData.priority || 'Low');
          setDate(taskData.dueDate || '');
          setStartDate(taskData.startDate || '');
          setChecklist(taskData.checkList || []);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || 'Error fetching task');
      }
    }
  
    getTask(); // استدعاء الدالة بعد تعريفها
  }, [id]); // من الجيد تضمين `id` إذا كان جزءاً من التبعيات
  


const update = async()=> {
try{
  
const {data} = await axios.put(`${apiUrl}/updateTask/${id}`,{
  taskTitle,taskDescription,priority,dueDate,startDate,checkList
})

if(data.error==false){
  toast.success("task updated")
  window.location.reload()
}
}catch(error){
  console.log(error);
  toast.error(error)
  
}
}


  return (
    <div>
      <Header />
      <div className='flex '>
        <Menu className="z-50" />
        <section className='bg-gray-100 w-full mt-20 py-10 '>
         
 <div  className='bg-white mx-7 px-7 py-10'>
 <div className='flex justify-between items-center  '>
 <input value={taskTitle} onChange={(e) => setTitle(e.target.value)} className='text-2xl font-bold' />

   
   <h1 className={`px-3 py-1 rounded-lg ${task.status == "Pending" ? "bg-yellow-100 text-yellow-500" :task.status == "In Progress" ? "bg-blue-100 text-blue-500" :"bg-green-100 text-green-500" }`}>{task.status}</h1>
 </div>
 <h1 className='mt-7 text-xl text-gray-500 font-bold'>Description</h1>
 <textarea
  value={taskDescription}
  onChange={(e) => setDescription(e.target.value)}
  className='mt-1 w-full border rounded p-2'
></textarea>

 
 <div className='flex items-center mt-5 gap-2'>
 <div>
   <h1 className='text-gray-500 font-bold'>priority</h1>
   <select value={priority} onChange={(e) => setPriority(e.target.value)}>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>

   <input type='text' className='w-[70px]'></input>
 </div>
 <div>
   <h1 className='text-gray-500 font-bold'>Start Date</h1>
   <input
  type="date"
  value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
  onChange={(e) => setStartDate(e.target.value)}
/>


 </div>
 <div>
   <h1 className='text-gray-500 font-bold'>Due Date</h1>
   <input
  type="date"
  value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
  onChange={(e) => setDate(e.target.value)}
/>


 </div>
 </div>
 <h1 className="text-xl font-bold text-gray-500 mb-2 mt-8">Todo Checklist</h1>
{Array.isArray(checkList) && checkList.map((item, index) => (
  <div key={index} className="space-y-2">
    <label className="flex items-center space-x-3">
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => {
          const updatedChecklist = [...checkList];
          updatedChecklist[index].done = !updatedChecklist[index].done;
          setChecklist(updatedChecklist);
        }}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-gray-700">{item.title}</span>
    </label>
  </div>
))}

 <button onClick={update} className='mt-5 bg-blue-500 rounded-lg px-3 py-1 hover:cursor-pointer text-white'>Update</button>
   </div>
        


        </section>
    </div>
    </div>
  )
}

export default Page