import {Routes,Route} from 'react-router-dom'
import Signup from './components/signup/Signup'
import Login from './components/login/Login'
import Home from './components/home/Home'
import Task from './components/task/Task'
import CreateTask from './components/createTask/CreateTask'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  

  return (
    <>
   <Routes>


{['/','signup'].map((path,index) => 
<Route path={path} element={<Signup />} key={index} />

)}

    <Route path='/login' element={<Login />} />
    <Route path='/home' element={<Home />} />
    <Route path='/task/:id' element={<Task />} />
    <Route path='/createTask' element={<CreateTask />} />
    <Route path='/dashboard' element={<Dashboard />} />
   </Routes>

    </>
  )
}

export default App
