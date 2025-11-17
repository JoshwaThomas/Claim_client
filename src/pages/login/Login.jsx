import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import usePost from "../../hooks/usePost";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { postData } = usePost();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await postData(`${apiUrl}/api/login`, { username, password });

      if (res.message === "Login successful!") {
        const { token, user } = res;

        localStorage.setItem("authToken", token);
        localStorage.setItem("username", user.username);

        Swal.fire("Success", "Login Successful!", "success");
        navigate(`/layout/${user.username}/dashboard`);
      } else {
        Swal.fire("Error", "Invalid credentials!", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* 🔥 Angled Gradient Background */}
      {/* 🔥 Angled Gradient Background */}
      <div
        className="
    absolute inset-0 
    bg-gradient-to-tr 
    from-[#4A00E0]/40 
    via-[#00E7FF]/20 
    to-[#00A2FF]/40 
    blur-3xl 
  "
      ></div>

      {/* Custom Polygon Shapes */}
      <div className="absolute -top-32 right-10 w-[450px] h-[350px] bg-[#5A00E0]/50 blur-[120px] opacity-50 rotate-[8deg]"
        style={{ clipPath: "polygon(0 0, 100% 15%, 85% 100%, 0 80%)" }}>
      </div>

      <div className="absolute bottom-0 left-0 w-[420px] h-[340px] bg-[#00E7FF]/50 blur-[140px] opacity-50 -rotate-[12deg]"
        style={{ clipPath: "polygon(10% 0, 100% 10%, 90% 90%, 0 100%)" }}>
      </div>

      {/* Diagonal Glass Card */}
      <div
        className="
          relative z-10 
          w-full max-w-md 
          backdrop-blur-2xl 
          bg-white/10 
          border border-white/20 
          rounded-2xl 
          p-10 
          shadow-2xl
          transform 
          rotate-0
          hover:rotate-0 
          transition-all duration-500
        "
      >
        {/* Header */}
        <h1 className="text-center text-4xl font-extrabold text-white mb-2 drop-shadow-lg tracking-wide">
          Sign In
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Access your <span className="text-cyan-300 font-semibold">Claim Manager</span>
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Username */}
          <div>
            <label className="text-gray-300 font-medium text-sm">Username</label>
            <div className="relative mt-1">
              <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-full py-3 pl-10 pr-4 
                  bg-white/10 
                  border border-white/20 
                  text-white 
                  rounded-lg 
                  placeholder-gray-400 
                  focus:ring-2 focus:ring-cyan-400 
                  focus:outline-none
                "
                placeholder="Enter username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 font-medium text-sm">Password</label>
            <div className="relative mt-1">
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full py-3 pl-10 pr-4 
                  bg-white/10 
                  border border-white/20 
                  text-white 
                  rounded-lg 
                  placeholder-gray-400 
                  focus:ring-2 focus:ring-cyan-400 
                  focus:outline-none
                "
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="
              w-full py-3 
              text-white 
              font-bold 
              rounded-lg 
              bg-gradient-to-r from-teal-600 via-cyan-700 to-blue-500
              hover:brightness-110
              shadow-xl shadow-cyan-700/40 
              transform hover:-translate-y-1 
              transition duration-300
            "
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-xs">
          © 2025 Claim Manager • All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
