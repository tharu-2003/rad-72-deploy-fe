import React, { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import Layout from '../components/Layout'


const Login = lazy (() => import("../pages/LoginPage"))
const Register = lazy (() => import ("../pages/RegisterPage"))
const Home = lazy (() => import ("../pages/Home"))
const Post = lazy (() => import ("../pages/Post"))
const MyPost = lazy (() => import ("../pages/MyPost"))

type  RequireAuthTypes = {children: ReactNode; roles?: string[]}
const RequireAuth = ({children , roles}: RequireAuthTypes) => {
  const { user, loading} = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace/>
  }

  if (roles && !roles.some((role) => user.roles?.includes(role))) {
    return(
      <div className='text-center py-20'>
        <h2 className='text-xl font-bold mb-2'> Access Denied</h2>
          <p>You do not have permission to view this page .</p>
      </div>
    )
  }

  return <>{children}</>
}

export default function Router() {
  return (
    <BrowserRouter>
        <Suspense fallback = {<div>Loading ...!</div>}>
            <Routes>
                <Route
                    path="/"
                    element={
                      <div className="flex items-center justify-center min-h-screen bg-gray-100">
                        <Link
                          to="/login"
                          className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl
                                    hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl 
                                    focus:ring-4 focus:ring-blue-300 active:scale-95"
                        >
                          Login
                        </Link>
                      </div>
                    }
                  />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route 
                  element={
                    <RequireAuth>
                      <Layout />
                    </RequireAuth>
                  }
                >
                  <Route path="/home" element={<Home />} />
                  <Route path="/post" element={<Post />} />
                  <Route path="/my-post" 
                    element={
                      <RequireAuth roles={["ADMIN", "USER", "AUTHOR"]}>
                        <MyPost />
                      </RequireAuth>
                    } />
              </Route>
            </Routes>
       </Suspense>
    </BrowserRouter>
  )
}