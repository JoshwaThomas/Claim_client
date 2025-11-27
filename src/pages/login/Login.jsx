import React, { useState } from 'react';
import usePost from '../../hooks/usePost';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import loginImage from '../../assets/loginImage1.png'

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { postData } = usePost();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postData(`${apiUrl}/api/login`, {
        username,
        password,
      });

      if (res.message === 'Login successful!') {
        const { token, user } = res; // ✅ FIXED: Directly use res.token, res.user

        localStorage.setItem('authToken', token);
        localStorage.setItem('username', user.username);

        Swal.fire('Success', 'Login Successful!', 'success');
        navigate(`/layout/${user.username}/dashboard`);
      } else {
        Swal.fire('Error', 'Login failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'An error occurred during login.', 'error');
    } finally {
      setLoading(false); // ✅ Ensures loading stops even on error
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        {/* Left Side Image */}
        <div className="md:w-1/2 w-full h-64 md:h-auto">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="md:w-1/2 w-full p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center tracking-tight">
            Claim Manager Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300 ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            © 2025 Claim Manager. All rights reserved.
          </p>
        </div>
      </div>
    </div>


  );
};

export default Login;
















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import usePost from "../../hooks/usePost";
// import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";

// const Login = () => {
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();
//   const { postData } = usePost();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await postData(`${apiUrl}/api/login`, { username, password });

//       if (res.message === "Login successful!") {
//         const { token, user } = res;

//         localStorage.setItem("authToken", token);
//         localStorage.setItem("username", user.username);

//         Swal.fire("Success", "Login Successful!", "success");
//         navigate(`/layout/${user.username}/dashboard`);
//       } else {
//         Swal.fire("Error", "Invalid credentials!", "error");
//       }
//     } catch (err) {
//       Swal.fire("Error", "Something went wrong!", "error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

//       {/* 🔥 Angled Gradient Background */}
//       {/* 🔥 Angled Gradient Background */}
//       <div
//         className="
//     absolute inset-0
//     bg-gradient-to-tr
//     from-[#4A00E0]/40
//     via-[#00E7FF]/20
//     to-[#00A2FF]/40
//     blur-3xl
//   "
//       ></div>

//       {/* Custom Polygon Shapes */}
//       <div className="absolute -top-32 right-10 w-[450px] h-[350px] bg-[#5A00E0]/50 blur-[120px] opacity-50 rotate-[8deg]"
//         style={{ clipPath: "polygon(0 0, 100% 15%, 85% 100%, 0 80%)" }}>
//       </div>

//       <div className="absolute bottom-0 left-0 w-[420px] h-[340px] bg-[#00E7FF]/50 blur-[140px] opacity-50 -rotate-[12deg]"
//         style={{ clipPath: "polygon(10% 0, 100% 10%, 90% 90%, 0 100%)" }}>
//       </div>

//       {/* Diagonal Glass Card */}
//       <div
//         className="
//           relative z-10
//           w-full max-w-md
//           backdrop-blur-2xl
//           bg-white/10
//           border border-white/20
//           rounded-2xl
//           p-10
//           shadow-2xl
//           transform
//           rotate-0
//           hover:rotate-0
//           transition-all duration-500
//         "
//       >
//         {/* Header */}
//         <h1 className="text-center text-4xl font-extrabold text-white mb-2 drop-shadow-lg tracking-wide">
//           Sign In
//         </h1>
//         <p className="text-center text-gray-300 mb-8">
//           Access your <span className="text-cyan-300 font-semibold">Claim Manager</span>
//         </p>

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-6">

//           {/* Username */}
//           <div>
//             <label className="text-gray-300 font-medium text-sm">Username</label>
//             <div className="relative mt-1">
//               <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//               <input
//                 type="text"
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="
//                   w-full py-3 pl-10 pr-4
//                   bg-white/10
//                   border border-white/20
//                   text-white
//                   rounded-lg
//                   placeholder-gray-400
//                   focus:ring-2 focus:ring-cyan-400
//                   focus:outline-none
//                 "
//                 placeholder="Enter username"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-gray-300 font-medium text-sm">Password</label>
//             <div className="relative mt-1">
//               <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="
//                   w-full py-3 pl-10 pr-4
//                   bg-white/10
//                   border border-white/20
//                   text-white
//                   rounded-lg
//                   placeholder-gray-400
//                   focus:ring-2 focus:ring-cyan-400
//                   focus:outline-none
//                 "
//                 placeholder="••••••••"
//               />
//             </div>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="
//               w-full py-3
//               text-white
//               font-bold
//               rounded-lg
//               bg-gradient-to-r from-teal-600 via-cyan-700 to-blue-500
//               hover:brightness-110
//               shadow-xl shadow-cyan-700/40
//               transform hover:-translate-y-1
//               transition duration-300
//             "
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-center text-gray-400 mt-8 text-xs">
//           © 2025 Claim Manager • All Rights Reserved
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
