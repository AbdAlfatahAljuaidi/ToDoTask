
import { useEffect } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../header/Header'
import Menu from '../menu/Menu'
import { useState } from 'react'

export default function Home() {
  const [tasks,setTasks]= useState([])
  const [filterStatus,setFilterStatus]=useState("All")
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {data} = await axios.get(`${apiUrl}/verifyToken`, {
          withCredentials: true,
        });
        console.log("cookies",data);
        
        if (data.error) {
          navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      }
    };
  
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.post(`${apiUrl}/showTasks`, {}, { withCredentials: true });
        setTasks(data.tasks);
        console.log("data",data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, []);
  


  const filteredTasks = filterStatus ==="All" ? tasks : tasks.filter(task => task.status.toLowerCase()===filterStatus.toLowerCase())


  return (
    <div>
      <Header />
      <div className='flex '>
        <Menu className="z-50" />
        <section className='bg-gray-100 w-full mt-20'>
          <div className='md:flex justify-between items-center px-5'>
            <div>
              <h1 className='p-7 text-4xl font-bold'>My Tasks </h1>
            </div>
            <div>
              <nav>
              <ul className='flex items-center space-x-4'>
              {["All", "Pending", "In Progress", "Completed"].map(status => (
                <li
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`mx-2 hover:cursor-pointer font-bold ${filterStatus === status ? ' text-blue-600' : ''}`}
                >
                  {status}
                </li>
              ))}
            </ul>
              </nav>
            </div>
          </div>

          <div className='grid md:grid-cols-3 grid-cols-1 gap-6 mb-5 px-6 mt-5'>
          {filteredTasks.map((task, index) => (
            <Link to={`/task/${task._id}`} key={index} >
  <div className="hover:cursor-pointer col-span-1 bg-white py-3 px-4 relative before:h-36 before:w-1 before:absolute before:bg-blue-500 before:left-[-4px] before:top-4 before:z-40 rounded-lg">
    <div className='flex items-center z-10'>
    <h1 className={`px-3 py-1 rounded-lg ${task.status == "Pending" ? "bg-yellow-100 text-yellow-500" :task.status == "In Progress" ? "bg-blue-100 text-blue-500" :"bg-green-100 text-green-500" }`}>{task.status}</h1>
    <h1 className={`px-3 py-1 rounded-lg mx-2 ${task.priority == "High" ? "bg-red-100 text-red-500" : task.priority == "Medium" ? "bg-blue-100 text-blue-500" :"bg-green-100 text-green-500" }`}>{task.priority}</h1>
    </div>
    <div className='mt-4'>
      <h1 className='font-bold text-xl'>{task.taskTitle}</h1>
      <p className='text-gray-700'>{task.taskDescription}</p>
      <h1 className='mt-2'>Task Done <span className='font-bold'> {new Date(task.dueDate).toLocaleDateString('en-GB')}</span></h1>
    </div>
    <div className='flex justify-between items-center mt-4'>
      <div>
        <h1 className='text-gray-500'>Start Date</h1>
        <h1 className='font-bold'>  {new Date(task.startDate).toLocaleDateString('en-GB')}</h1>
      </div>
      <div>
        <h1 className='text-gray-500'>Due Date</h1>
        <h1 className='font-bold'>
  {new Date(task.dueDate).toLocaleDateString('en-GB')}
</h1>
      </div>
    </div>
  </div>
  </Link>
))}


          



          </div>

        </section>
      </div>
    </div>
  )
}
