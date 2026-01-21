
import React, { useEffect, useState } from 'react'
import Header from '../header/Header'
import Menu from '../menu/Menu'
import axios from 'axios'

const Page = () => {
  const [tasks, setTasks] = useState([])
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const formattedDate = today.toLocaleDateString('en-US', options);

  const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.post(`${apiUrl}/showTasks`, {}, { withCredentials: true });
        setTasks(data.tasks);
        console.log("data", data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const total = tasks.length;
  const pending = tasks.filter(task => task.status === "Pending").length;
  const inProgress = tasks.filter(task => task.status === "In Progress").length;
  const completed = tasks.filter(task => task.status === "Completed").length;

  return (
    <div>
      <Header />
      <div className='flex flex-col md:flex-row'>
        <Menu className="z-50" />
        <section className='bg-gray-100 w-full mt-20 p-5'>
          <div className='bg-white rounded-lg p-5'>
            <h1 className='text-2xl md:text-4xl font-bold'>Welcome</h1>
            <p className='text-gray-500 mt-1'>{formattedDate}</p>

            {/* Statistics section */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7'>
              {[
                { count: total, label: 'Total Tasks', color: 'bg-blue-500' },
                { count: pending, label: 'Pending Tasks', color: 'bg-purple-500' },
                { count: inProgress, label: 'In Progress Tasks', color: 'bg-cyan-500' },
                { count: completed, label: 'Completed Tasks', color: 'bg-green-500' },
              ].map((item, i) => (
                <div key={i} className={`relative flex items-center p-3 bg-gray-50 rounded-md`}>
                  <span className={`before:content-[''] before:absolute before:h-5 before:w-1 before:rounded-2xl before:left-[-12px] before:top-[2px] before:${item.color}`}></span>
                  <span className='font-bold'>{item.count}</span>
                  <h1 className='mx-1 text-gray-500 text-sm'>{item.label}</h1>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Table */}
          <div className='mt-10'>
            <h1 className='text-lg font-semibold mb-3'>All Tasks</h1>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm">
                    <th className="py-2 px-4 border-b">Task Name</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Priority</th>
                    <th className="py-2 px-4 border-b">Created On</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">No tasks available.</td>
                    </tr>
                  ) : (
                    tasks.map((task, index) => (
                      <tr key={index} className="hover:bg-gray-50 text-sm">
                        <td className="py-2 px-4 border-b">{task.taskTitle}</td>
                        <td className={`py-2 px-4 border-b ${
                          task.status === "Pending" ? "text-yellow-600"
                          : task.status === "In Progress" ? "text-blue-600"
                          : "text-green-600"
                        }`}>{task.status}</td>
                        <td className={`py-2 px-4 border-b ${
                          task.priority === "High" ? "text-red-500"
                          : task.priority === "Medium" ? "text-blue-500"
                          : "text-green-500"
                        }`}>{task.priority}</td>
                        <td className="py-2 px-4 border-b">
                          {new Date(task.createdAt).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Page
