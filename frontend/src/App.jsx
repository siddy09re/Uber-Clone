import { Routes , Route, createBrowserRouter, BrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import UserLogin from './Pages/User/UserLogin'
import UserRegister from './Pages/User/UserRegister'
import CaptainLogin from './Pages/Captain/CaptainLogin'
import CaptainRegister from './Pages/Captain/CaptainRegister'
import './App.css'

function App() {


  const router = createBrowserRouter([
    
        { 
          path:'/',
          element: <Home/>
        },
        
        {
          path:'/User-login',
          element:<UserLogin/>
        },
        {
          path:'/User-register',
          element:<UserRegister/>
        },
        {
          path:'/Captain-login',
          element :<CaptainLogin/>
        },
        {
          path : '/Captain-register',
          element:<CaptainRegister/> 
        }
      
  ])

  return (
   <RouterProvider router={router}>



   </RouterProvider>
  )
}

export default App
