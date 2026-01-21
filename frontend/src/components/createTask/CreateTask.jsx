'use client'
import React, { useState } from 'react'
import Header from '../header/Header'
import Menu from '../menu/Menu'
import axios from 'axios'
import { toast } from 'react-toastify';

const Page = () => {
  const [taskTitle, setTitle] = useState("");
  const [taskDescription, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [newChecklist, setNewChecklist] = useState("");
  const [checkList, setChecklist] = useState([]);

  const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;


  const handleAddChecklistItem = () => {
    if (newChecklist.trim() !== "") {
      setChecklist(prev => [...prev, { title: newChecklist.trim(), done: false }]);
      setNewChecklist("");
    }
  };
  const AddTask = async () => {
    try {
      const { data } = await axios.post(`${apiUrl}/CreateTask`, {
        taskTitle,
        taskDescription,
        priority,
        startDate,
        dueDate,
        checkList
      }, {
        withCredentials: true  // هذا السطر مهم جداً لإرسال الكوكيز مع الطلب
      });
  
      if (data.error === false) {
        toast.success("Task has been created successfully");
      }
      setTitle("");
      setDescription("");
      setPriority("Low");
      setDate("");
      setStartDate("");
      setChecklist([]);
      setNewChecklist("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create task");
    }
  };
  

  return (
    <div>
      <Header />
      <div className='flex flex-col md:flex-row'>
        <Menu />
        <div className='mt-20 bg-gray-100 w-full p-5'>
          <div className=' p-5 rounded-lg max-w-3xl '>
            <h1 className='py-5 text-2xl md:text-4xl font-bold'>Create Task</h1>

            <label className="block text-lg font-sans">Task Title</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={taskTitle}
              type='text'
              className='mt-1 border px-3 border-gray-400 rounded-lg w-full h-10'
            />

            <label className="block text-lg font-sans mt-5">Task Description</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={taskDescription}
              className='mt-1 border py-2 px-3 border-gray-400 rounded-lg w-full'
            />

            <div className='flex flex-col sm:flex-row sm:items-end sm:gap-5 mt-5'>
              <div className='flex-1'>
                <label className="block text-lg font-sans">Priority</label>
                <select
                  onChange={(e) => setPriority(e.target.value)}
                  value={priority}
                  className='w-full px-3 py-2 bg-white border border-gray-400 rounded-lg'
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className='flex-1'>
                <label className="block text-lg font-sans">Start Date</label>
                <input
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                  type='date'
                  className='w-full px-3 py-2 border border-gray-400 rounded-lg'
                />
              </div>

              <div className='flex-1'>
                <label className="block text-lg font-sans">Due Date</label>
                <input
                  onChange={(e) => setDate(e.target.value)}
                  value={dueDate}
                  type='date'
                  className='w-full px-3 py-2 border border-gray-400 rounded-lg'
                />
              </div>
            </div>

            <label className="block text-lg font-sans mt-5">ToDo Checklist</label>
            <div className='flex flex-col sm:flex-row gap-3'>
              <input
                onChange={(e) => setNewChecklist(e.target.value)}
                value={newChecklist}
                placeholder='Enter Task'
                type='text'
                className='mt-1 px-3 h-10 border border-gray-400 rounded-lg w-full'
              />
              <button
                onClick={handleAddChecklistItem}
                className='bg-green-500 py-2 px-5 w-full text-white rounded-lg'
              >
                Add List
              </button>
            </div>

            <ul className="mt-4 list-disc px-5 text-gray-700">
              {checkList.map((item, index) => (
                <li key={index}>{item.title}</li>
              ))}
            </ul>

            <button
              onClick={AddTask}
              className=' bg-blue-500 py-2 px-6 w-full text-white rounded-lg hover:bg-blue-600 transition-all'
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
