// ============ ==> 19/08/2025

// "use client";
// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser, resetUserState } from "@/redux/slices/userSlice";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { loginPage } from "@/helper/RouteName";
// import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     confirmPassword: "",
//     name: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { loading, error, successMessage } = useSelector((state) => state.user);

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleRegister = () => {
//     const { username, password, confirmPassword, name } = formData;

//     if (!username || !password || !confirmPassword || !name) {
//       toast.error("All fields are required!");
//       return;
//     }

//     if (!emailRegex.test(username)) {
//       toast.error("Please enter a valid email address!");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     const payload = {
//       user_id: username,
//       password,
//       name,
//       user_type: "admin", // always admin
//     };

//     dispatch(registerUser(payload));
//   };

//   // ✅ Mount hone par purana success/error clear
//   useEffect(() => {
//     dispatch(resetUserState());
//   }, [dispatch]);

//   // ✅ Success/Error handling
//   useEffect(() => {
//     if (successMessage) {
//       toast.success("You have successfully created an account!");
//       setTimeout(() => {
//         dispatch(resetUserState()); // Reset before redirect
//         router.push(loginPage);
//       }, 2000);
//     }

//     if (error) {
//       toast.error(error);
//       dispatch(resetUserState());
//     }
//   }, [successMessage, error, dispatch, router]);

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
//       <ToastContainer />
//       <Card className="w-[380px] shadow-lg rounded-2xl">
//         <CardContent className="p-6">
//           {/* <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">
//             Sports Ladder
//           </h2> */}
// {/*
//           <h2 className="text-2xl font-bold text-center flex-col flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">

//                    <button
//               type="button"
//               onClick={()=>router.push("/demo-page")}
//               className="text-gray-600 hover:text-gray-800 cursor-pointer hover:bg-blue-300 px-2 py-2 rounded-full"
//             >
//               {<Eye size={22} />}
//             </button>

//             Sports Ladder

//           </h2> */}

//           {/* Name */}
//           <div className="mb-4">
//             <Label htmlFor="fullname" className="font-semibold text-blue-600 text-md">
//               Name
//             </Label>
//             <Input
//               id="fullname"
//               placeholder="Enter your name"
//               value={formData.name}
//               onChange={(e) => handleChange("name", e.target.value)}
//               className="mt-1 rounded-none"
//             />
//           </div>

//           {/* Username / Email */}
//           <div className="mb-4">
//             <Label htmlFor="username" className="font-semibold text-blue-600 text-md">
//               Username/Email
//             </Label>
//             <Input
//               id="username"
//               placeholder="Enter your email address"
//               value={formData.username}
//               onChange={(e) => handleChange("username", e.target.value)}
//               className="mt-1 rounded-none"
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-4 relative">
//             <Label htmlFor="password" className="font-semibold text-blue-600 text-md">
//               Password
//             </Label>
//             <Input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={(e) => handleChange("password", e.target.value)}
//               className="mt-1 pr-10 rounded-none"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* Confirm Password */}
//           <div className="mb-4 relative">
//             <Label htmlFor="confirmPassword" className="font-semibold text-blue-600 text-md">
//               Confirm Password
//             </Label>
//             <Input
//               id="confirmPassword"
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="Confirm your password"
//               value={formData.confirmPassword}
//               onChange={(e) => handleChange("confirmPassword", e.target.value)}
//               className="mt-1 pr-10 rounded-none"
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
//             >
//               {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* Register Button */}
//           <Button
//             onClick={handleRegister}
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
//           >
//             {loading ? "Registering..." : "Register Now"}
//           </Button>

//           {/* Redirect to Login */}
//           <div className="mt-4 text-sm text-center">
//             <p>
//               Already have an account?{" "}
//               <Link href={loginPage} className="text-blue-600 underline">
//                 Login here
//               </Link>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// ===========================

// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser, resetUserState } from "@/redux/slices/userSlice";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { loginPage } from "@/helper/RouteName";
// import { Eye, EyeOff } from "lucide-react";
// import { motion } from "framer-motion";

// // Mock illustration (replace with actual image or dynamic import)
// import RegisterImage from "@/public/sign-up.gif";
// import Image from "next/image";

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     confirmPassword: "",
//     name: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { loading, error, successMessage } = useSelector((state) => state.user);

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleRegister = () => {
//     const { username, password, confirmPassword, name } = formData;

//     if (!username || !password || !confirmPassword || !name) {
//       toast.error("All fields are required!");
//       return;
//     }

//     if (!emailRegex.test(username)) {
//       toast.error("Please enter a valid email address!");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     const payload = {
//       user_id: username,
//       password,
//       name,
//       user_type: "admin",
//     };

//     dispatch(registerUser(payload));
//   };

//   useEffect(() => {
//     dispatch(resetUserState());
//   }, [dispatch]);

//   useEffect(() => {
//     if (successMessage) {
//       toast.success("Account created successfully!");
//       setTimeout(() => {
//         dispatch(resetUserState());
//         router.push(loginPage);
//       }, 2000);
//     }

//     if (error) {
//       toast.error(error);
//       dispatch(resetUserState());
//     }
//   }, [successMessage, error, dispatch, router]);

//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-blue-100 to-indigo-900 overflow-hidden">
//       {/* Left Side - Illustration */}
//       <motion.div
//         initial={{ opacity: 0, x: -50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="flex-2 flex items-center justify-center p-8 bg-transparent relative overflow-hidden"
//       >
//         {/* Background Glow */}
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl -z-10"></div>

//         {/* Illustration */}
//         <div className="relative z-10 text-center max-w-md mx-auto">
//           <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
//             {/* Animated Title */}
//             <motion.h2
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//               className="text-4xl sm:text-5xl md:text-5xl font-extrabold mb-6 leading-tight"
//             >
//               <span className="text-zinc-800 drop-shadow-2xl">Welcome to</span>
//               <br />
//               <span className="bg-gradient-to-r text-zinc-900  from-blue-300 via-purple-300 to-pink-300 bg-clip-text font-black drop-shadow-2xl relative">
//                 Sportssolutionspro
//                 {/* Subtle Shine Effect */}
//                 <motion.span
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 to-transparent h-full w-full opacity-20"
//                   animate={{
//                     backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
//                   }}
//                   transition={{
//                     duration: 3,
//                     repeat: Infinity,
//                     ease: "linear",
//                   }}
//                   style={{
//                     background:
//                       "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
//                     backgroundSize: "200% 100%",
//                     clipPath: "inset(0 0 90% 0)",
//                   }}
//                 />
//               </span>
//             </motion.h2>

//             {/* Animated Subtitle */}
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
//               className="text-lg sm:text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
//             >
//               Join clubs across the UK and manage your ladder with{" "}
//               <span className="font-semibold text-blue-100">
//                 real-time rankings
//               </span>
//               ,{" "}
//               <span className="font-semibold text-blue-100">
//                 easy match scheduling
//               </span>
//               , and{" "}
//               <span className="font-semibold text-blue-100">
//                 full transparency
//               </span>
//               .
//             </motion.p>

//             {/* Floating Badge - Real-Time Indicator */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
//               className="inline-block mb-8"
//             >
//               {/* <span className="px-6 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-100 text-sm font-medium rounded-full border border-green-300/30 backdrop-blur-sm flex items-center gap-2 shadow-lg">
//       <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
//       Live Rankings • Updated Every 10s
//     </span> */}
//             </motion.div>

//             {/* Optional: Floating Action Button or CTA */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.8 }}
//             >
//               {/* <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300">
//       Start Your Ladder
//     </button> */}
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Right Side - Registration Form */}
//       <motion.div
//         initial={{ opacity: 0, x: 50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="flex-2 flex items-center justify-center p-6"
//       >
//         <Card className="w-full max-w-md shadow-2xl border-none bg-white/80 backdrop-blur-sm rounded-2xl">
//           <CardContent className="p-8">
          

//             {/* Name */}
//             <div className="mb-5">
//               <Label htmlFor="fullname" className="font-semibold text-gray-700">
//                 Full Name
//               </Label>
//               <Input
//                 id="fullname"
//                 placeholder="Enter your name"
//                 value={formData.name}
//                 onChange={(e) => handleChange("name", e.target.value)}
//                 className="mt-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
//               />
//             </div>

//             {/* Email */}
//             <div className="mb-5">
//               <Label htmlFor="username" className="font-semibold text-gray-700">
//                 Email Address
//               </Label>
//               <Input
//                 id="username"
//                 placeholder="you@example.com"
//                 value={formData.username}
//                 onChange={(e) => handleChange("username", e.target.value)}
//                 className="mt-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
//               />
//             </div>

//             {/* Password */}
//             <div className="mb-5 relative">
//               <Label htmlFor="password" className="font-semibold text-gray-700">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={(e) => handleChange("password", e.target.value)}
//                 className="mt-1 pr-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             {/* Confirm Password */}
//             <div className="mb-6 relative">
//               <Label
//                 htmlFor="confirmPassword"
//                 className="font-semibold text-gray-700"
//               >
//                 Confirm Password
//               </Label>
//               <Input
//                 id="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={formData.confirmPassword}
//                 onChange={(e) =>
//                   handleChange("confirmPassword", e.target.value)
//                 }
//                 className="mt-1 pr-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
//               >
//                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             {/* Register Button */}
//             <Button
//               onClick={handleRegister}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
//             >
//               {loading ? "Creating Account..." : "Register Now"}
//             </Button>

//             {/* Login Link */}
//             <div className="mt-6 text-center text-sm text-gray-600">
//               Already have an account?{" "}
//               <Link
//                 href={loginPage}
//                 className="text-blue-600 font-medium hover:underline"
//               >
//                 Login here
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Toast Notifications */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// }






// ======================

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetUserState } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginPage } from "@/helper/RouteName";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image"; // Assuming RegisterImage is handled correctly

// Mock illustration (replace with actual image or dynamic import)
// import RegisterImage from "@/public/sign-up.gif"; // Uncomment if you are using it

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, successMessage } = useSelector((state) => state.user);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    const { username, password, confirmPassword, name } = formData;

    if (!username || !password || !confirmPassword || !name) {
      toast.error("All fields are required!");
      return;
    }

    if (!emailRegex.test(username)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const payload = {
      user_id: username,
      password,
      name,
      user_type: "admin",
    };

    dispatch(registerUser(payload));
  };

  useEffect(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success("Account created successfully!");
      setTimeout(() => {
        dispatch(resetUserState());
        router.push(loginPage);
      }, 2000);
    }

    if (error) {
      toast.error(error);
      dispatch(resetUserState());
    }
  }, [successMessage, error, dispatch, router]);

  return (
    // Base Gradient and Subtle Pattern Overlay
    <div className="flex flex-col md:flex-row h-screen bg-indigo-900 overflow-hidden relative">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-900 z-0"></div>
      
      {/* Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: "radial-gradient(#ffffff33 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Left Side - Illustration (Z-index 10) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-2 flex items-center justify-center p-8 bg-transparent relative z-10 overflow-hidden"
      >
        {/* Background Glow */}
       

        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          {/* Animated Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-5xl font-extrabold mb-6 leading-tight"
          >
            <span className="text-zinc-800 drop-shadow-2xl">Welcome to</span>
            <br />
            <span className="bg-gradient-to-r text-zinc-900 from-blue-300 via-purple-300 to-pink-300 bg-clip-text font-black drop-shadow-2xl relative">
              Sportssolutionspro
              {/* Subtle Shine Effect */}
              {/* Shine effect is great, keeping it */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 to-transparent h-full w-full opacity-20"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  backgroundSize: "200% 100%",
                  clipPath: "inset(0 0 90% 0)",
                }}
              />
            </span>
          </motion.h2>

          {/* Animated Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
          >
            Join clubs across the UK and manage your ladder with{" "}
            <span className="font-semibold text-blue-100">
              real-time rankings
            </span>
            ,{" "}
            <span className="font-semibold text-blue-100">
              easy match scheduling
            </span>
            , and{" "}
            <span className="font-semibold text-blue-100">
              full transparency
            </span>
            .
          </motion.p>
          
          {/* You can add your RegisterImage here if needed */}
        </div>
      </motion.div>

      {/* Right Side - Registration Form (Z-index 10) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-2 flex items-center justify-center p-6 relative z-10"
      >
        <Card className="w-full max-w-md shadow-2xl border-none bg-white/80 backdrop-blur-xl rounded-2xl z-20">
          <CardContent className="p-8">
            
            {/* ENHANCEMENT: Form Title */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">
                  Create Your Account
                </h1>
                <p className="text-gray-500 mt-2">
                  Start managing your ladders today!
                </p>
            </div>
            {/* End ENHANCEMENT */}
            

            {/* Name */}
            <div className="mb-5">
              <Label htmlFor="fullname" className="font-semibold text-gray-700">
                Full Name
              </Label>
              <Input
                id="fullname"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                // ENHANCEMENT: Polished focus ring
                className="mt-1 rounded-lg border-gray-300 transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <Label htmlFor="username" className="font-semibold text-gray-700">
                Email Address
              </Label>
              <Input
                id="username"
                placeholder="you@example.com"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                // ENHANCEMENT: Polished focus ring
                className="mt-1 rounded-lg border-gray-300 transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Password */}
            <div className="mb-5 relative">
              <Label htmlFor="password" className="font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                // ENHANCEMENT: Polished focus ring
                className="mt-1 pr-10 rounded-lg border-gray-300 transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="mb-6 relative">
              <Label
                htmlFor="confirmPassword"
                className="font-semibold text-gray-700"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                // ENHANCEMENT: Polished focus ring
                className="mt-1 pr-10 rounded-lg border-gray-300 transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Register Button */}
            <Button
              onClick={handleRegister}
              disabled={loading}
              // ENHANCEMENT: Button with better padding, rounded corners, and hover effect
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold py-3 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              {loading ? "Creating Account..." : "Register Now"}
            </Button>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href={loginPage}
                className="text-blue-600 font-medium hover:underline hover:text-purple-700 transition-colors duration-200"
              >
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}