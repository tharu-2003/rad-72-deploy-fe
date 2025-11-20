import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { register } from "../services/auth";


const Register: React.FC = () => {
  const [firstname, setfirstName] = useState("");
  const [lastname, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registered:", { name, email, password });

    try{
        const data = register(email , password, firstname, lastname)
        console.log(data)
        alert("register successfully ..")
    }catch(err){
        console.error(err)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        <form className="space-y-4">
          {/* firstName */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">first Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setfirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* lastName */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setlastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
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
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
            onClick={handleRegister}
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;