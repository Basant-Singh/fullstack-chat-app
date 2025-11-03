import {createBrowserRouter, Navigate, RouterProvider} from 'react-router';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import Homepage from './pages/Homepage.jsx';
import { useAuthStore } from './Store/useAuthStore.js';
import { useEffect } from 'react';
import {Loader} from 'lucide-react';
import Auth from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import RootLayout from './components/RootLayout.jsx';
import { useThemeStore } from './Store/useThemeStore.js';

const router = createBrowserRouter([
  {
    path:'/',
    element: <RootLayout/>,
    children:[
        {
            path:'/',
            element:<Homepage/>
        },
        {
            path:'/signup',
            element: <Auth/>,
        },
        {
            path:'/login',
            element: <Auth/>
        },
        {
          path:'/profile',
          element: <Profile/>,
        },
        {
          path:'/settings',
          element: <Settings/>,
        }

    ]
  }
])

function App() {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/> 
      </div>
    )
  }


  return (
    <>
    <div data-theme={theme}>
      <RouterProvider router={router}/>
      <Toaster/>
    </div>
    </>
  )
}

export default App
