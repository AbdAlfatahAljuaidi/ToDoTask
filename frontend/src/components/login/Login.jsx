'use client'
import React,{useState} from 'react'
import image from '../../assets/Sign.jpg'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate,Link } from 'react-router-dom';

const Page = () => {
  
  const navigate = useNavigate();


  const [email,setEmail]=useState()
  const [password,setPassword]=useState()
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;


  const Login = async () => {
    try{
      setIsLoading(true);
      
const {data} = await axios.post(`${apiUrl}/login`, {
  email,
  password
}, {
  withCredentials: true // ⬅️ ضروري جدًا
})

console.log("data =",data);

if(data.error==false){
  console.log("sucess");

  
  
  navigate('/home');
  toast.success("User login succesffuly")
  setIsLoading(false);
}
    }catch(error){

      if(error.response.data.message){
        toast.error(error.response.data.message)
        setIsLoading(false);
      }else{
        toast.error("User Login faild")
        setIsLoading(false);
      }
    }
  }


  return (
    <section
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* ✅ خلفية شفافة زجاجية فعليًا */}
      <div className="rounded-3xl bg-white/90   p-8 ">
        <h1 className="text-blue-500 text-center text-4xl font-bold">Login</h1>

       
        <input
          placeholder="Email"
          type="text"
          className="border border-black block mt-5 w-[300px] text-gray-700  rounded-xl p-2  focus:bg-white/70"
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className="border border-black block mt-5 w-[300px] text-gray-700  rounded-xl p-2  focus:bg-white/70"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <div className="flex justify-center">
          <button disabled={isLoading} className={`bg-blue-500  text-white rounded-lg py-2 px-7 mt-6 hover:bg-blue-600 transition ${isLoading ? 'opacity-50 cursor-not-allowed' :'hover:cursor-pointer'}`} onClick={Login}>
          {isLoading ? 'Logging in' : "Login"}
          </button>
        </div>
        <div className="text-center mt-4">
  <span className="text-gray-600">Do not have an account? </span>
  <Link to="/signup" className="text-blue-600 hover:underline">
    Sign Up
  </Link>
</div>
      </div>
    </section>
  )
}

export default Page
