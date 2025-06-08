import { Routes , Route, createBrowserRouter, BrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import UserLogin from './Pages/User/UserLogin'
import UserRegister from './Pages/User/UserRegister'
import CaptainLogin from './Pages/Captain/CaptainLogin'
import CaptainRegister from './Pages/Captain/CaptainRegister'
import UserScreen from './Pages/User/UserScreen'
import CaptainScreen from './Pages/Captain/CaptainScreen'
import './App.css'
import UserProtected from './ProtectedRoutes/UserProtected'
import CaptainProtected from './ProtectedRoutes/CaptainProtected'
import UserRiding from './Pages/User/UserRiding'
import CaptainRiding from './Pages/Captain/CaptainRiding'

import 'mapbox-gl/dist/mapbox-gl.css';
import ForgotPassword from './Components/ForgotPassword'

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
        },
        {
          path : '/User-screen',
          element: <UserProtected> <UserScreen/> </UserProtected>
        },
        {
          path : '/Captain-screen',
          element :<CaptainProtected>  <CaptainScreen/> </CaptainProtected>
        },
        {
          path: '/User-riding',
          element: <UserProtected> <UserRiding/> </UserProtected>
        },
        {
          path:'/Captain-riding',
          element: <CaptainProtected> <CaptainRiding/> </CaptainProtected>
        },
        {
          path : '/forgot-password',
          element : <ForgotPassword/>
        }
      
  ])

  return (
   <RouterProvider router={router}>

   </RouterProvider>
  )
}

export default App
