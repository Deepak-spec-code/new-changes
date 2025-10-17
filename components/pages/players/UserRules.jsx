
// // ==========================

// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogFooter,
// } from "@/components/ui/alert-dialog";

// import { ChevronDown, ChevronUp } from "lucide-react";

// const APPKEY =
//   "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

// const UserRules = () => {
//   const [isEditingIndex, setIsEditingIndex] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showSuccessDialog, setShowSuccessDialog] = useState(false);

//   const ladderId = useSelector((state) => state.user?.user?.ladder_id);
//   const userType = useSelector((state) => state.user?.user?.user_type); // admin / user
//   const userEmail = useSelector((state) => state.user?.user?.user_id);

//   const [rules, setRules] = useState([]);
//   const [tempTitle, setTempTitle] = useState("");
//   const [tempContent, setTempContent] = useState("");
//   const [openRuleIds, setOpenRuleIds] = useState([]); // ✅ multiple toggle ke liye





//   useEffect(() => {
//   const fetchRules = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `https://ne-games.com/leaderBoard/api/user/getRulesSuggestion?ladder_id=${ladderId}`,
//         { headers: { APPKEY } }
//       );

//       if (res.data.status === 200 && Array.isArray(res.data.data)) {
//         setRules(res.data.data);

//         // 🔥 By default, sabhi open
//         setOpenRuleIds(res.data.data.map((_, index) => index));
//       }
//     } catch (error) {
//       console.error("Error fetching rules:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (ladderId) fetchRules();
// }, [ladderId]);


//   const handleEdit = (index) => {
//     setIsEditingIndex(index);
//     setTempTitle(rules[index].title || "");
//     setTempContent(rules[index].rules || "");
//   };

//   const handleSave = (index) => {
//     const updatedRules = [...rules];
//     updatedRules[index] = {
//       ...updatedRules[index],
//       title: tempTitle,
//       rules: tempContent,
//     };
//     setRules(updatedRules);
//     setIsEditingIndex(null);
//     setShowSuccessDialog(true);
//   };

//   const handleCancel = () => {
//     setIsEditingIndex(null);
//   };

//   const toggleRule = (index) => {
//     setOpenRuleIds((prev) =>
//       prev.includes(index)
//         ? prev.filter((id) => id !== index) // close
//         : [...prev, index] // open
//     );
//   };

//   if (loading) return <p className="text-gray-600">Loading rules...</p>;

//   return (
//     <div className="space-y-6 w-full sm:px-6 md:px-0 max-w-full">
//       {rules.map((rule, index) => {
//         const isOpen = openRuleIds.includes(index); // ✅ individual open/close

//         return (
//           <div key={index} className="space-y-2 w-full md:p-4 rounded">
//             {isEditingIndex === index && userType === "admin" ? (
//               <div className="space-y-3 w-full">
//                 <Input
//                   className="text-xl sm:text-2xl font-bold text-blue-900 w-full"
//                   value={tempTitle}
//                   onChange={(e) => setTempTitle(e.target.value)}
//                 />
//                 <Textarea
//                   className="w-full"
//                   rows={4}
//                   value={tempContent}
//                   onChange={(e) => setTempContent(e.target.value)}
//                 />
//                 <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
//                   <Button
//                     onClick={() => handleSave(index)}
//                     className="mt-2 sm:mt-0 bg-blue-600 cursor-pointer px-6 sm:px-8 rounded font-semibold hover:bg-blue-700 w-full sm:w-auto"
//                   >
//                     Save
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     onClick={handleCancel}
//                     className="mt-2 sm:mt-0 bg-red-100 cursor-pointer px-6 sm:px-8 rounded font-semibold hover:bg-red-200 w-full sm:w-auto"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="w-full">
//                 {/* Title */}
//                 <div className="bg-cyan-200 flex items-center justify-between gap-2 shadow p-4 text-blue-900 text-xl sm:text-2xl font-bold rounded">
//                   <span className="break-words">{rule.title || "No Title"}</span>

//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => toggleRule(index)}
//                     className="flex items-center gap-1"
//                   >
//                     <span className="text-sm text-black cursor-pointer ">
//                       {isOpen ? "CLOSE" : "OPEN"}
//                     </span>
//                     {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                   </Button>
//                 </div>

//                 {/* Content */}
//                 {isOpen && (
//                   <div>
//                     <p className="mt-2 bg-white p-4 font-semibold rounded shadow text-base sm:text-lg whitespace-pre-line break-words  max-h-[380px] overflow-y-auto">
//                       {rule.rules || "No content available."}
//                     </p>
//                   </div>
//                 )}

//                 {/* ✅ Button bottom-right */}
//                 {(userType === "admin" || userEmail === "joebloggs@gmail.com") && (
//                   <div className="flex justify-end mt-3">
//                     {userEmail === "joebloggs@gmail.com" ? (
//                       // 🔴 Show dialog instead of edit for joebloggs
//                       <AlertDialog>
//                         <AlertDialogContent>
//                           <AlertDialogHeader>
//                             <AlertDialogTitle className="text-red-600">
//                               Only Admin can edit
//                             </AlertDialogTitle>
//                           </AlertDialogHeader>
//                           <p className="text-gray-700">
//                             You do not have permission to edit the rules.
//                           </p>
//                           <AlertDialogFooter>
//                             <Button
//                               className="bg-blue-600 text-white hover:bg-blue-700"
//                               onClick={() => {}}
//                             >
//                               OK
//                             </Button>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>

//                         <Button
//                           size="sm"
//                           className="bg-red-500 hover:bg-red-600 py-6 px-5 cursor-pointer rounded-none text-white"
//                         >
//                           Admin <br /> can Edit info
//                         </Button>
//                       </AlertDialog>
//                     ) : (
//                       // 🔵 Normal admin edit
//                       <Button
//                         size="sm"
//                         onClick={() => handleEdit(index)}
//                         className="bg-blue-500 hover:bg-blue-600 text-white"
//                       >
//                         Admin can Edit info
//                       </Button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       })}

//       {/* ✅ Success AlertDialog */}
//       <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-green-600">
//               Content Changes Successful
//             </AlertDialogTitle>
//           </AlertDialogHeader>
//           <p className="text-gray-700">
//             Your rule changes have been updated successfully!
//           </p>
//           <AlertDialogFooter>
//             <Button
//               onClick={() => setShowSuccessDialog(false)}
//               className="bg-blue-600 text-white hover:bg-blue-700"
//             >
//               OK
//             </Button>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default UserRules;














// =================

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { ChevronDown, ChevronUp } from "lucide-react";

const APPKEY =
  "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

const UserRules = () => {
  const [isEditingIndex, setIsEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const ladderId = useSelector((state) => state.user?.user?.ladder_id);
  const userType = useSelector((state) => state.user?.user?.user_type); // admin / user
  const userEmail = useSelector((state) => state.user?.user?.user_id);

  const [rules, setRules] = useState([]);
  const [tempTitle, setTempTitle] = useState("");
  const [tempContent, setTempContent] = useState("");
  const [openRuleIds, setOpenRuleIds] = useState([]); // multiple toggle

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://ne-games.com/leaderBoard/api/user/getRulesSuggestion?ladder_id=${ladderId}`,
          { headers: { APPKEY } }
        );

        if (res.data.status === 200 && Array.isArray(res.data.data)) {
          setRules(res.data.data);
          setOpenRuleIds(res.data.data.map((_, index) => index)); // open all by default
        }
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setLoading(false);
      }
    };

    if (ladderId) fetchRules();
  }, [ladderId]);

  const handleEdit = (index) => {
    setIsEditingIndex(index);
    setTempTitle(rules[index].title || "");
    setTempContent(rules[index].rules || "");
  };

  const handleSave = (index) => {
    const updatedRules = [...rules];
    updatedRules[index] = {
      ...updatedRules[index],
      title: tempTitle,
      rules: tempContent,
    };
    setRules(updatedRules);
    setIsEditingIndex(null);
    setShowSuccessDialog(true);
  };

  const handleCancel = () => {
    setIsEditingIndex(null);
  };

  const toggleRule = (index) => {
    setOpenRuleIds((prev) =>
      prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]
    );
  };

  if (loading) return <p className="text-white/80">Loading rules...</p>;

  return (
    <div className="space-y-6 w-full sm:px-6 md:px-0 max-w-full bg-[#0b1020] text-white">
      {rules.map((rule, index) => {
        const isOpen = openRuleIds.includes(index);

        return (
          <div key={index} className="space-y-2 w-full rounded">
            {isEditingIndex === index && userType === "admin" ? (
              <div className="space-y-3 w-full">
                <Input
                  className="text-xl sm:text-2xl font-bold w-full bg-white/10 border-white/10 placeholder:text-white/50 text-white"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="Enter rule title"
                />
                <Textarea
                  className="w-full bg-white/10 border-white/10 text-white placeholder:text-white/50"
                  rows={5}
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  placeholder="Write rule content..."
                />
                <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
                  <Button
                    onClick={() => handleSave(index)}
                    className="mt-2 sm:mt-0 bg-cyan-600 hover:bg-cyan-500 cursor-pointer px-6 sm:px-8 rounded font-semibold w-full sm:w-auto text-white"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="mt-2 sm:mt-0 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 cursor-pointer px-6 sm:px-8 rounded font-semibold w-full sm:w-auto text-red-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {/* Title */}
                <div className="flex items-center justify-between gap-2 shadow p-4 text-xl sm:text-2xl font-bold rounded bg-white/10 border border-white/10">
                  <span className="break-words text-white/90">
                    {rule.title || "No Title"}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRule(index)}
                    className="flex items-center gap-1 text-white hover:bg-white/10"
                  >
                    <span className="text-sm cursor-pointer">
                      {isOpen ? "CLOSE" : "OPEN"}
                    </span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </div>

                {/* Content */}
                {isOpen && (
                  <div>
                    <p className="mt-2 bg-white/5 border border-white/10 p-4 font-semibold rounded shadow text-base sm:text-lg whitespace-pre-line break-words max-h-[380px] overflow-y-auto text-white/90">
                      {rule.rules || "No content available."}
                    </p>
                  </div>
                )}

                {/* Admin / Demo user controls */}
                {(userType === "admin" || userEmail === "joebloggs@gmail.com") && (
                  <div className="flex justify-end mt-3">
                    {userEmail === "joebloggs@gmail.com" ? (
                      <AlertDialog>
                        <AlertDialogContent className="bg-[#0b1020] text-white border border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-300">
                              Only Admin can edit
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <p className="text-white/80">
                            You do not have permission to edit the rules.
                          </p>
                          <AlertDialogFooter>
                            <Button
                              className="bg-cyan-600 text-white hover:bg-cyan-500"
                              onClick={() => {}}
                            >
                              OK
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>

                        <Button
                          size="sm"
                          className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 cursor-pointer text-red-200"
                        >
                          Admin <br /> can Edit info
                        </Button>
                      </AlertDialog>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleEdit(index)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white"
                      >
                        Admin can Edit info
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Success dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-[#0b1020] text-white border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-300">
              Content Changes Successful
            </AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-white/80">
            Your rule changes have been updated successfully!
          </p>
          <AlertDialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-cyan-600 text-white hover:bg-cyan-500"
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserRules;
