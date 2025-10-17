// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { ToastContainer, toast } from "react-toastify";
// import { FaArrowRightLong } from "react-icons/fa6";
// import { Eye, EyeOff, X } from "lucide-react";
// import Link from "next/link";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser, resetUserState } from "@/redux/slices/userSlice";
// import Image from "next/image";

// // Shadcn Dialog
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import EyeLogo from "@/public/eyeLogin.png";
// import DummyPlayerList from "@/components/shared/DummyPlayerList";

// import {
//   forgotPassword,
//   resetForgotPasswordState,
// } from "@/redux/slices/forgetPasswordSlice";
// import ActivityLogUser from "@/components/shared/ActivityLogUser";
// import DummyActivity from "@/components/shared/DummyActivity";

// const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

// export default function LoginUser({ ladderId }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [decodedLadderId, setDecodedLadderId] = useState(ladderId || null);

//   // Forgot Password
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [isForgotOpen, setIsForgotOpen] = useState(false);

//   // 👇 New state to control DummyPlayerList modal
//   const [showDummyPlayers, setShowDummyPlayers] = useState(false);
//   const [showLadder, setShowLadder] = useState(true); // ✅ Toggle state

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { loading, error, user, isFreePlanExpired } = useSelector(
//     (state) => state.user
//   );

//   const searchParams = useSearchParams();
//   const from = searchParams.get("from");
//   const encodedFromQuery = searchParams.get("id");


//   const {
//     loading: forgotLoading,
//     success: forgotSuccess,
//     error: forgotError,
//     message: forgotMessage,
//   } = useSelector((state) => state.forgotPassword);

//   // useEffect(() => {
//   //   if (!decodedLadderId && encodedFromQuery) {
//   //     try {
//   //       const decoded = atob(decodeURIComponent(encodedFromQuery));
//   //       setDecodedLadderId(decoded);
//   //     } catch (e) {
//   //       console.error("Invalid encoded ladder ID", e);
//   //     }
//   //   }
//   // }, [encodedFromQuery, decodedLadderId]);





// useEffect(() => {
//   if (!decodedLadderId && encodedFromQuery) {
//     try {
//       // ✅ Safe decode function
//       const safeDecodeBase64 = (str) => {
//         // Base64 regex check (only letters, numbers, +, /, and = allowed)
//         const isBase64 = /^[A-Za-z0-9+/=]+$/.test(str);
//         if (!isBase64) {
//           console.warn("Invalid Base64 string:", str);
//           return null;
//         }
//         return atob(str);
//       };

//       const decoded = safeDecodeBase64(decodeURIComponent(encodedFromQuery));

//       if (decoded) {
//         setDecodedLadderId(decoded);
//       } else {
//         console.warn("Failed to decode ladder ID, skipping...");
//       }
//     } catch (e) {
//       console.error("Invalid encoded ladder ID", e);
//     }
//   }
// }, [encodedFromQuery, decodedLadderId]);



//   useEffect(() => {
//     if (from === "ladder") {
//       toast.info(
//         "Use the same exact details you used to create your account.",
//         { autoClose: 5000 }
//       );
//     }
//   }, [from]);

//   const handleLogin = async () => {
//     if (!username || !password) {
//       toast.error("Username and Password are required!");
//       return;
//     }

//     const payload = {
//       user_id: username,
//       password,
//       user_type: "user",
//       ladder_id: decodedLadderId,
//     };

//     try {
//       const res = await dispatch(loginUser(payload)).unwrap();
//       const userData = res?.data;

//       if (!userData || !userData.id) {
//         toast.error("Currently Your Account is InActive.");
//         return;
//       }

//       toast.success("Login successful!");

//       if (userData.user_type === "user") {
//         router.push("/user-page-redirect");
//       } else {
//         toast.error("Invalid user type.");
//       }
//     } catch (err) {
//       toast.error("Login failed. Please check your credentials.");
//     }
//   };

//   useEffect(() => {
//     if (error) {
//       dispatch(resetUserState());
//     }
//   }, [error, dispatch]);

//   // 👁 Eye button handler – sirf DummyPlayerList dikhaye
//   const handleEyeClick = () => {
//     setShowDummyPlayers(true);
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

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 px-4">
//       <ToastContainer />
//       <Card className="w-full max-w-sm shadow-lg rounded-2xl">
//         <CardContent className="p-6">
//           {/* Heading with Eye Button */}
//           <h2 className="text-2xl font-bold text-center flex flex-col items-center justify-center gap-2 text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text mb-6">
//             <button
//               type="button"
//               onClick={handleEyeClick}
//               className="hover:bg-blue-200 rounded-full cursor-pointer"
//             >
//               <Image src={EyeLogo} alt="eye icons" height={100} width={100} />
//             </button>
//           </h2>

//           {/* Username */}
//           <div className="mb-4">
//             <Label className="text-blue-600 py-2 font-semibold text-lg">
//               Username/Email
//             </Label>
//             <Input
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your email address"
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-4 relative">
//             <Label className="text-blue-600 py-2 font-semibold text-lg">
//               Password
//             </Label>
//             <Input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="pr-10"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-[52px] text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           {/* Login Btn */}
//           <Button
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 font-semibold flex items-center justify-center gap-2"
//             onClick={handleLogin}
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//             {!loading && <FaArrowRightLong />}
//           </Button>

//           {/* Register + Forgot */}
//           <div className="mt-4 text-sm text-center">
//             <p>
//               Don&apos;t have an account?{" "}
//               <Link
//                 href={`/register-user${
//                   decodedLadderId
//                     ? `/${encodeURIComponent(btoa(decodedLadderId))}`
//                     : ""
//                 }`}
//                 className="text-blue-600 underline"
//               >
//                 Register here
//               </Link>
//             </p>

//             {/* Forgot Password Modal Trigger */}
//             <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
//               <DialogTrigger asChild>
//                 <button className="text-purple-600 underline cursor-pointer py-2">
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

//           {isFreePlanExpired && (
//             <p className="mt-4 text-sm text-red-600 text-center">
//               ⚠️ Your free plan has expired. Please upgrade to continue.
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Dummy Player List Modal */}
//       {/* Dummy Player List + Activity Modal */}
// {showDummyPlayers && (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//     <div className="bg-white w-[95%] max-w-6xl p-6 rounded-lg shadow-lg relative">
//       {/* Close Button */}
//       <button
//         className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
//         onClick={() => setShowDummyPlayers(false)}
//       >
//         <X size={22} />
//       </button>

//       {/* 🆕 Flexbox layout for Player List & Activity */}
//       <div className="flex">
//         {/* Player List Section */}
//         <div className="">
//           <DummyPlayerList ladderId={decodedLadderId} />
//         </div>

//         {/* Activity Section */}
//         <div className="">
//           <DummyActivity />
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// }













// ==================================

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowRightLong } from "react-icons/fa6";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetUserState } from "@/redux/slices/userSlice";
import Image from "next/image";
import EyeLogo from "@/public/eyeLogin.png";

import {
  forgotPassword,
  resetForgotPasswordState,
} from "@/redux/slices/forgetPasswordSlice";

const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

export default function LoginUser({ ladderId }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [decodedLadderId, setDecodedLadderId] = useState(ladderId || null);

  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, user, isFreePlanExpired } = useSelector(
    (state) => state.user
  );

  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const encodedFromQuery = searchParams.get("id");

  const {
    loading: forgotLoading,
    success: forgotSuccess,
    error: forgotError,
    message: forgotMessage,
  } = useSelector((state) => state.forgotPassword);

  useEffect(() => {
    if (!decodedLadderId && encodedFromQuery) {
      try {
        const safeDecodeBase64 = (str) => {
          const isBase64 = /^[A-Za-z0-9+/=]+$/.test(str);
          if (!isBase64) return null;
          return atob(str);
        };

        const decoded = safeDecodeBase64(decodeURIComponent(encodedFromQuery));
        if (decoded) setDecodedLadderId(decoded);
      } catch (e) {
        console.error("Invalid encoded ladder ID", e);
      }
    }
  }, [encodedFromQuery, decodedLadderId]);

  useEffect(() => {
    if (from === "ladder") {
      toast.info(
        "Use the same exact details you used to create your account.",
        { autoClose: 5000 }
      );
    }
  }, [from]);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Username and Password are required!");
      return;
    }

    const payload = {
      user_id: username,
      password,
      user_type: "user",
      ladder_id: decodedLadderId,
    };

    try {
      const res = await dispatch(loginUser(payload)).unwrap();
      const userData = res?.data;

      if (!userData || !userData.id) {
        toast.error("Currently Your Account is InActive.");
        return;
      }

      toast.success("Login successful!");

      if (userData.user_type === "user") {
        router.push("/user-page-redirect");
      } else {
        toast.error("Invalid user type.");
      }
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (error) dispatch(resetUserState());
  }, [error, dispatch]);

  // ✅ Eye button handler – now router navigation
  const handleEyeClick = () => {
    router.push(`/ladder-view?ladderId=${decodedLadderId}&tab=ladder`);
  };

  // ✅ Forgot password handler with slice
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <ToastContainer />
      <Card className="w-full max-w-sm shadow-lg rounded-2xl">
        <CardContent className="p-6">
          {/* Heading with Eye Button */}
          <h2 className="text-2xl font-bold text-center flex flex-col items-center justify-center gap-2 text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text mb-6">
            <button
              type="button"
              onClick={handleEyeClick}
              className="hover:bg-blue-200 rounded-full cursor-pointer"
            >
              <Image src={EyeLogo} alt="eye icons" height={100} width={100} />
            </button>
          </h2>

          {/* Username */}
          <div className="mb-4">
            <Label className="text-blue-600 py-2 font-semibold text-lg">
              Username/Email
            </Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <Label className="text-blue-600 py-2 font-semibold text-lg">
              Password
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[52px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Login Btn */}
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 font-semibold flex items-center justify-center gap-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <FaArrowRightLong />}
          </Button>

          {/* Register + Forgot */}
          <div className="mt-4 text-sm text-center">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href={`/register-user${
                  decodedLadderId
                    ? `/${encodeURIComponent(btoa(decodedLadderId))}`
                    : ""
                }`}
                className="text-blue-600 underline"
              >
                Register here
              </Link>
            </p>
            <button
              onClick={() => setIsForgotOpen(true)}
              className="text-purple-600 underline cursor-pointer py-2"
            >
              Forgot Password
            </button>
          </div>

          {isFreePlanExpired && (
            <p className="mt-4 text-sm text-red-600 text-center">
              Your free plan has expired. Please upgrade to continue.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
