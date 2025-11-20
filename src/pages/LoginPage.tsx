
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { getMyDetails, login } from "../services/auth";
import { useAuth } from "../context/authContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setUser} = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    console.log("UserName:", username);
    console.log("Password:", password);

    try{
      const data:any = await login(username, password)

      if(data?.data?.accessToken){
        localStorage.setItem("accessToken", data.data.accessToken)
        localStorage.setItem("refreshToken", data.data.refreshToken)
        // sessionStorage.setItem
        //coockies

        const resData = await getMyDetails()
        setUser(resData.data)
        navigate("/home")
        
        //  navigate to home 
      }else{
          alert("Login faild..")
      }
    }catch(err){
      console.error(err)
    }

    // try{
    //   const response =await  axios.post("http://localhost:5000/api/v1/auth/login" , {
    //     email : username,
    //     password   // password : password
    //   }, {headers : {
    //     "Content-Type" : "application/json"
    //   }})

    //   alert("Login successful! Welcome " + username);
    //   console.log(response)
    // }catch(err){
    //     console.error(err)
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-700 mb-1">UserName</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your userName"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 font-medium hover:underline">
          Sign Up
        </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;