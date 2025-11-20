import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export default function Header() {

    const { user , setUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate("/login")
    }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link 
            to="/home" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            to="/post" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Posts
          </Link>
          {(user?.roles?.includes("ADMIN") || user?.roles?.includes("AUTHOR")) &&(
            <Link 
                to="/my-post" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
                My Posts
            </Link>
          )}
        </nav>
        <div>
          <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}