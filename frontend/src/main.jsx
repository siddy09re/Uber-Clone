import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './Pages/context/UserContext.jsx'
import CaptainContext from './Pages/context/CaptainContext.jsx'
import { Provider } from 'react-redux'
import { store } from './Redux/Store.jsx'
import SocketProvider from './Pages/context/SocketContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
    <Provider store={store}>
    <CaptainContext>
      <UserContext>
        <App />
      </UserContext>
    </CaptainContext>
   </Provider>
   </SocketProvider>
  </StrictMode>,
)
