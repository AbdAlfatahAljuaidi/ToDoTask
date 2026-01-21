'use client'
import React, { useEffect, useState } from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { IoAddCircle, IoLogOutSharp } from "react-icons/io5";
import { GiHamburgerMenu } from 'react-icons/gi';
import axios from 'axios';
import { useNavigate,useLocation ,Link } from 'react-router-dom';

const Page = () => {
  const [info, setInfo] = useState({})
  const [open, setOpen] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;


  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {data} = await axios.get(`${apiUrl}/verifyToken`, {
          withCredentials: true,
        });
        
        if (data.error) {
          navigate('/login');
        }
        
        console.log("cookies",data.user);
setInfo(data.user)
      } catch (err) {
        navigate('/login');
      }
    };
  
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${apiUrl}/logout`, {}, {
        withCredentials: true
      });

      if (!data.error) {
        navigate('/login');
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  

  const navItems = (
    <ul>
     
      <li className={`text-xl flex items-center font-semibold hover:cursor-pointer mt-5 px-2 py-1 ${pathname == "/home" ? "bg-blue-100 text-blue-500" : ""}`}>
        <BiTask className="mr-2" />
        <Link to="/home" onClick={() => setOpen(false)}>Manage Task</Link>
      </li>
      <li className={`text-xl flex items-center font-semibold hover:cursor-pointer mt-5 px-2 py-1 ${pathname == "/createTask" ? "bg-blue-100 text-blue-500" : ""}`}>
        <IoAddCircle className='mr-2' />
        <Link to="/createTask" onClick={() => setOpen(false)}>Create Task</Link>
      </li>
      <li className={`text-xl flex items-center mt-5 font-semibold hover:cursor-pointer px-2 py-1 ${pathname == "/dashboard" ? "bg-blue-100 text-blue-500" : ""}`}>
        <MdOutlineDashboard className='mr-2' />
        <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
      </li>
      <li onClick={handleLogout} className='text-xl flex items-center font-semibold hover:cursor-pointer mt-5'>
        <IoLogOutSharp className='mx-2' /> Logout
      </li>
    </ul>
  )

  return (
    <>
      {/* Burger menu button (for small screens) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button onClick={() => setOpen(!open)}>
          <GiHamburgerMenu size={28} />
        </button>
      </div>

      {/* Sidebar for medium and up */}
      <div className="w-[300px] p-5 h-screen mt-20 py-9 md:block hidden z-30">
        <div className='flex justify-center items-center h-16 w-16 bg-blue-500 mx-auto rounded-full'>
        <h1 className='text-white font-bold text-2xl'>
  {info?.username
    ? info.username.charAt(0).toUpperCase() 
    : "Loading..."}
</h1>

        </div>
        <h1 className='mx-auto w-fit mt-3 text-xl font-bold'>{info.username}</h1>
        <h1 className='mx-auto w-fit text-gray-400'>{info.email}</h1>
        <nav className='mt-10'>
          {navItems}
        </nav>
      </div>

      {/* Sidebar overlay for mobile */}
      {open && (
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-5 md:hidden">
          <div className='flex justify-between items-center mb-5'>
            <h1 className='text-xl font-bold'>Menu</h1>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          {navItems}
        </div>
      )}
    </>
  )
}

export default Page
