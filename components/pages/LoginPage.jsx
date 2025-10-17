

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { ToastContainer, toast } from "react-toastify";
// import { FaArrowRightLong } from "react-icons/fa6";
// import Link from "next/link";
// import "react-toastify/dist/ReactToastify.css";

// // Redux
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser, resetUserState } from "@/redux/slices/userSlice";
// import { forgotPassword,resetForgotPasswordState } from "@/redux/slices/forgetPasswordSlice";
// import { adminPage, registerPage } from "@/helper/RouteName";
// import { Eye, EyeOff } from "lucide-react";

// // Shadcn Dialog
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   // Forgot Password
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [isForgotOpen, setIsForgotOpen] = useState(false);

//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { loading, error, user, isFreePlanExpired } = useSelector(
//     (state) => state.user
//   );

//   const {
//     loading: forgotLoading,
//     success: forgotSuccess,
//     error: forgotError,
//     message: forgotMessage,
//   } = useSelector((state) => state.forgotPassword);

//   const searchParams = useSearchParams();
//   const from = searchParams.get("from");

//   useEffect(() => {
//     if (from === "ladder") {
//       toast.info("Use the same exact details you used to create your account.", {
//         autoClose: 5000,
//       });
//     }
//   }, [from]);

//   const handleLogin = async () => {
//     if (!username || !password) {
//       toast.error("Username and Password are required!");
//       return;
//     }

//     const payload = {
//       user_id: username.trim().toLowerCase(),
//       password: password.trim(),
//       user_type: "admin", // This is the intended login type
//     };

//     try {
//       const res = await dispatch(loginUser(payload)).unwrap();

//       if (res?.data?.user_type === "user") {
//         toast.error(
//           "Incorrect login type! This account is a normal user, not an admin."
//         );
//         return;
//       }

//       if (res?.status === 200) {
//         localStorage.setItem("userData", JSON.stringify(res.data));
//       }

//       toast.success(res?.success_message || "Login successful!");
//       router.push(adminPage);
//     } catch (err) {
//       toast.error(
//         err?.error_message ||
//           err?.message ||
//           "Login failed. Please check your credentials."
//       );
//     }
//   };

//   // ✅ Forgot password handler with slice
//   const handleForgotPassword = () => {
//     if (!forgotEmail) {
//       toast.error("Please enter your email!");
//       return;
//     }
//     dispatch(forgotPassword(forgotEmail));
//   };

//   // ✅ Show toast on forgot password API result
//   useEffect(() => {
//     if (forgotSuccess) {
//       toast.success("Reset link sent to your Registered Email!");
//       setIsForgotOpen(false);
//       setForgotEmail("");
//       dispatch(resetForgotPasswordState());
//     }
//     if (forgotError) {
//       toast.error(
//         typeof forgotError === "string"
//           ? forgotError
//           : "Failed to send reset link"
//       );
//       dispatch(resetForgotPasswordState());
//     }
//   }, [forgotSuccess, forgotError, forgotMessage, dispatch]);

//   useEffect(() => {
//     if (error) {
//       dispatch(resetUserState());
//     }
//   }, [error, dispatch]);

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
//       <ToastContainer />
//       <Card className="w-[380px] shadow-lg rounded-2xl">
//         <CardContent className="p-6">
//           {/* Username */}
//           <div className="mb-4">
//             <Label
//               htmlFor="username"
//               className="text-blue-600 py-2 font-semibold text-xl"
//             >
//               Username/Email
//             </Label>
//             <Input
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your email address"
//             />
//           </div>

//           {/* Password with Eye Toggle */}
//           <div className="mb-4 relative">
//             <Label
//               htmlFor="password"
//               className="text-blue-600 py-2 font-semibold text-xl"
//             >
//               Password
//             </Label>
//             <Input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="pr-10"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-13 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* Login Button */}
//           <Button
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 font-semibold flex items-center justify-center gap-2"
//             onClick={handleLogin}
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//             {!loading && <FaArrowRightLong />}
//           </Button>

//           {/* Links */}
//           <div className="mt-4 text-sm text-center space-y-2">
//             <p>
//               Don&apos;t have an account?{" "}
//               <Link href={registerPage} className="text-blue-600 underline">
//                 Register here
//               </Link>
//             </p>

//             {/* Forgot Password Modal Trigger */}
//             <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
//               <DialogTrigger asChild>
//                 <button className="text-purple-600 underline">
//                   Forgot Password
//                 </button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle>Reset Password</DialogTitle>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <Label htmlFor="forgotEmail">Enter your email</Label>
//                   <Input
//                     id="forgotEmail"
//                     placeholder="example@email.com"
//                     value={forgotEmail}
//                     onChange={(e) => setForgotEmail(e.target.value)}
//                   />
//                 </div>
//                 <DialogFooter className="mt-4">
//                   <Button
//                     className="bg-blue-500 text-white"
//                     onClick={handleForgotPassword}
//                     disabled={forgotLoading}
//                   >
//                     {forgotLoading ? "Sending..." : "Send Reset Link"}
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>

//           {/* Free Plan Expired Warning */}
//           {isFreePlanExpired && (
//             <p className="mt-4 text-sm text-red-600 text-center">
//               ⚠️ Your free plan has expired. Please upgrade to continue.
//             </p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }










// ===============================

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetUserState } from "@/redux/slices/userSlice";
import { forgotPassword, resetForgotPasswordState } from "@/redux/slices/forgetPasswordSlice";
import { adminPage, registerPage } from "@/helper/RouteName";
import { Eye, EyeOff } from "lucide-react";

// Shadcn Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

// Framer Motion for Animations
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error, isFreePlanExpired } = useSelector(
    (state) => state.user
  );

  const {
    loading: forgotLoading,
    success: forgotSuccess,
    error: forgotError,
    message: forgotMessage,
  } = useSelector((state) => state.forgotPassword);

  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  useEffect(() => {
    if (from === "ladder") {
      toast.info("Use the same exact details you used to create your account.", {
        autoClose: 5000,
      });
    }
  }, [from]);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Username and Password are required!");
      return;
    }

    const payload = {
      user_id: username.trim().toLowerCase(),
      password: password.trim(),
      user_type: "admin", // This is the intended login type
    };

    try {
      const res = await dispatch(loginUser(payload)).unwrap();

      if (res?.data?.user_type === "user") {
        toast.error(
          "Incorrect login type! This account is a normal user, not an admin."
        );
        return;
      }

      if (res?.status === 200) {
        localStorage.setItem("userData", JSON.stringify(res.data));
      }

      toast.success(res?.success_message || "Login successful!");
      router.push(adminPage);
    } catch (err) {
      toast.error(
        err?.error_message ||
          err?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      toast.error("Please enter your email!");
      return;
    }
    dispatch(forgotPassword(forgotEmail));
  };

  useEffect(() => {
    if (forgotSuccess) {
      toast.success("Reset link sent to your Registered Email!");
      setIsForgotOpen(false);
      setForgotEmail("");
      dispatch(resetForgotPasswordState());
    }
    if (forgotError) {
      toast.error(
        typeof forgotError === "string"
          ? forgotError
          : "Failed to send reset link"
      );
      dispatch(resetForgotPasswordState());
    }
  }, [forgotSuccess, forgotError, forgotMessage, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(resetUserState());
    }
  }, [error, dispatch]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-indigo-900 overflow-hidden relative">
      {/* Base Gradient and Pattern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-900 z-0"></div>
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: "radial-gradient(#ffffff33 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Left Side - Illustration/Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-2 flex items-center justify-center p-8 bg-transparent relative z-10 overflow-hidden"
      >
        {/* Background Glow */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl -z-10"></div> */}

        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          {/* Animated Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-5xl font-extrabold mb-6 leading-tight"
          >
            <span className="text-zinc-800 drop-shadow-2xl">Welcome Back to</span>
            <br />
            <span className="bg-gradient-to-r text-zinc-900 from-blue-300 via-purple-300 to-pink-300 bg-clip-text font-black drop-shadow-2xl relative">
              Sportssolutionspro
              {/* Subtle Shine Effect */}
              <motion.span
                className="absolute inset-0 h-full w-full opacity-20"
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
            Access your **admin dashboard** to manage real-time rankings, match schedules, and user accounts.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-2 flex items-center justify-center p-6 relative z-10"
      >
        <Card className="w-full max-w-md shadow-2xl border-none bg-white/80 backdrop-blur-xl rounded-2xl z-20">
          <CardContent className="p-8">
             
            {/* Form Title */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">
                    Admin Login
                </h1>
                <p className="text-gray-500 mt-2">
                    Please enter your credentials to proceed.
                </p>
            </div>
            
            {/* Username */}
            <div className="mb-5">
              <Label htmlFor="username" className="font-semibold text-gray-700">
                Username/Email
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email address"
                className="mt-1 rounded-lg border-gray-300 transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="mb-6 relative">
              <Label htmlFor="password" className="font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 pr-10 rounded-lg border-gray-300 transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // Position adjustment for better alignment with the new input style
                className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Login Button */}
            <Button
              // Enhanced Button style for a premium look
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold py-3 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-300"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
              {!loading && <FaArrowRightLong className="ml-2" />}
            </Button>

            {/* Links and Dialog */}
            <div className="mt-6 text-sm text-center space-y-3">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link 
                  href={registerPage} 
                  className="text-blue-600 font-medium hover:underline hover:text-purple-700 transition-colors duration-200"
                >
                  Register here
                </Link>
              </p>

              {/* Forgot Password Modal Trigger (Styling adjusted) */}
              <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
                <DialogTrigger asChild>
                  <button className="text-purple-600 font-medium hover:underline hover:text-blue-700 transition-colors duration-200">
                    Forgot Password
                  </button>
                </DialogTrigger>
                
                {/* Dialog Content */}
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Reset Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <Label htmlFor="forgotEmail" className="font-semibold">Enter your email address to receive a reset link.</Label>
                    <Input
                      id="forgotEmail"
                      placeholder="example@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="focus:border-blue-500 focus:ring-blue-500/50"
                    />
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      onClick={handleForgotPassword}
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Free Plan Expired Warning */}
            {isFreePlanExpired && (
              <p className="mt-4 text-sm text-red-600 font-semibold text-center p-2 bg-red-50 rounded-lg border border-red-200">
                ⚠️ Your free plan has expired. Please upgrade to continue.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

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
