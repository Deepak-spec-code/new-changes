
// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import axios from "axios";
// import { useSearchParams } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import RulesForLadder from "./RulesForLadder";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

// const LadderRulesCard = ({ ladderIdProp }) => {
//   const searchParams = useSearchParams();
//   const ladderId =
//     ladderIdProp || searchParams.get("id") || searchParams.get("ladder_id");

//   const [isEditing, setIsEditing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [openRuleIds, setOpenRuleIds] = useState([]); // yeh rakha for individual toggle

//   const [rulesList, setRulesList] = useState([]);
//   const [tempRulesList, setTempRulesList] = useState([]);

//   useEffect(() => {
//     if (!ladderId) return;

//     const fetchRules = async () => {
//       try {
//         const res = await axios.get(
//           `https://ne-games.com/leaderBoard/api/user/getRulesSuggestion?ladder_id=${ladderId}`,
//           { headers: { APPKEY } }
//         );

//         if (res.data.status === 200 && Array.isArray(res.data.data)) {
//           setRulesList(res.data.data);
//           setTempRulesList(res.data.data);

//           // ✅ By default sabhi open
//           setOpenRuleIds(res.data.data.map((rule) => rule.id));
//         }
//       } catch (error) {
//         console.error("Error fetching rules:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRules();
//   }, [ladderId]);

//   const handleSave = async (ruleId) => {
//     try {
//       const rule = tempRulesList.find((r) => r.id === ruleId);
//       if (!rule) return;

//       await axios.post(
//         "https://ne-games.com/leaderBoard/api/user/updateRulesDocument",
//         {
//           id: rule.id,
//           title: rule.title,
//           rules: rule.rules,
//         },
//         { headers: { APPKEY } }
//       );

//       setRulesList([...tempRulesList]);
//       setIsEditing(null);
//     } catch (error) {
//       console.error("Error updating rules:", error);
//       alert("Failed to update rules. Please try again.");
//     }
//   };

//   const handleCancel = () => {
//     setTempRulesList(rulesList);
//     setIsEditing(null);
//   };

//   const toggleRule = (ruleId) => {
//     setOpenRuleIds(
//       (prev) =>
//         prev.includes(ruleId)
//           ? prev.filter((id) => id !== ruleId) // close
//           : [...prev, ruleId] // open
//     );
//   };

//   if (loading) {
//     return (
//       <div className="space-y-4 w-full max-w-full px-4 sm:px-6 md:px-8">
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-24 w-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 w-full px-4 sm:px-6 md:px-8 max-w-full">
//       {rulesList.map((rule, idx) => {
//         const isCurrentEditing = isEditing === rule.id;
//         const isOpen = openRuleIds.includes(rule.id); // ✅ per-rule open/close
//         return (
//           <div key={rule.id} className="space-y-3 border-b pb-4 w-full">
//             {isCurrentEditing ? (
//               <>
//                 <Input
//                   className="text-xl sm:text-2xl font-bold text-blue-900 w-full bg-white p-4 rounded shadow whitespace-pre-line break-words  max-h-[380px] overflow-y-auto"
//                   value={tempRulesList[idx].title}
//                   onChange={(e) => {
//                     const newList = [...tempRulesList];
//                     newList[idx].title = e.target.value;
//                     setTempRulesList(newList);
//                   }}
//                 />
//                 {/* EDIT MODE */}
//                 <Textarea
//                   className="w-full bg-white p-4 font-semibold rounded shadow text-base sm:text-lg whitespace-pre-line break-words  max-h-[380px] overflow-y-auto"
//                   rows={6}
//                   value={tempRulesList[idx].rules}
//                   onChange={(e) => {
//                     const newList = [...tempRulesList];
//                     newList[idx].rules = e.target.value;
//                     setTempRulesList(newList);
//                   }}
//                   style={{ resize: "vertical" }} // allow vertical resizing if needed
//                 />

//                 <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
//                   <Button
//                     onClick={() => handleSave(rule.id)}
//                     className="mt-2 sm:mt-0 bg-blue-600 cursor-pointer px-4 sm:px-8 rounded font-semibold hover:bg-blue-700 w-full sm:w-auto"
//                   >
//                     Save
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     onClick={handleCancel}
//                     className="mt-2 sm:mt-0 bg-red-100 cursor-pointer px-4 sm:px-8 rounded font-semibold hover:bg-red-200 w-full sm:w-auto"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="bg-cyan-200 flex items-center justify-between gap-2 p-4 shadow  text-blue-900 text-xl sm:text-2xl font-bold  rounded break-words ">
//                   {rule.title || "Ladder Rules"}

//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => toggleRule(rule.id)}
//                     className="flex items-center gap-1"
//                   >
//                     <span className="text-sm text-black cursor-pointer ">
//                       {isOpen ? "CLOSE" : "OPEN"}
//                     </span>
//                     {isOpen ? (
//                       <ChevronUp size={16} />
//                     ) : (
//                       <ChevronDown size={16} />
//                     )}
//                   </Button>
//                 </div>

//                 {isOpen && (
//                   <div>
//                     <p className="mt-2 bg-white p-4 font-semibold rounded shadow text-base sm:text-lg whitespace-pre-line break-words  max-h-[380px] overflow-y-auto">
//                       {rule.rules || "No rules available."}
//                     </p>
//                     <div className="flex flex-col sm:flex-row mt-4 justify-end gap-2 w-full">
//                       <Button
//                         className="mt-2 sm:mt-0 bg-red-600 cursor-pointer px-4 sm:px-8 rounded font-semibold hover:bg-red-600 w-full sm:w-auto"
//                         onClick={() => setIsEditing(rule.id)}
//                       >
//                         Edit Info
//                       </Button>

//                       {idx === rulesList.length - 1 && (
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button className="mt-2 sm:mt-0 bg-blue-600 cursor-pointer px-4 sm:px-8 rounded font-semibold hover:bg-blue-700 w-full sm:w-auto">
//                               Ideas For Rules
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="max-h-[90vh] w-full sm:max-w-3xl md:max-w-4xl overflow-y-auto px-4">
//                             <DialogHeader>
//                               <DialogTitle className="text-lg sm:text-xl text-blue-900">
//                                 RULES FOR LADDER
//                               </DialogTitle>
//                             </DialogHeader>
//                             <div>
//                               <RulesForLadder />
//                             </div>
//                           </DialogContent>
//                         </Dialog>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default LadderRulesCard;










// ==============================

"use client";

import React, { useState, useEffect } from "react";
// Assuming these are dark-theme compatible (shadcn/ui or custom)
import { Button } from "@/components/ui/button"; 
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// Assuming RulesForLadder component also gets the dark theme
import RulesForLadder from "./RulesForLadder"; 
import { ChevronDown, ChevronUp, Edit, Save, X } from "lucide-react"; // Added Save, X, Edit for better icons

const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

const LadderRulesCard = ({ ladderIdProp }) => {
  const searchParams = useSearchParams();
  const ladderId =
    ladderIdProp || searchParams.get("id") || searchParams.get("ladder_id");

  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openRuleIds, setOpenRuleIds] = useState([]);

  const [rulesList, setRulesList] = useState([]);
  const [tempRulesList, setTempRulesList] = useState([]);

  useEffect(() => {
    if (!ladderId) return;

    const fetchRules = async () => {
      try {
        const res = await axios.get(
          `https://ne-games.com/leaderBoard/api/user/getRulesSuggestion?ladder_id=${ladderId}`,
          { headers: { APPKEY } }
        );

        if (res.data.status === 200 && Array.isArray(res.data.data)) {
          setRulesList(res.data.data);
          setTempRulesList(res.data.data);

          // ✅ By default sabhi open
          setOpenRuleIds(res.data.data.map((rule) => rule.id));
        }
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [ladderId]);

  const handleSave = async (ruleId) => {
    try {
      const rule = tempRulesList.find((r) => r.id === ruleId);
      if (!rule) return;

      await axios.post(
        "https://ne-games.com/leaderBoard/api/user/updateRulesDocument",
        {
          id: rule.id,
          title: rule.title,
          rules: rule.rules,
        },
        { headers: { APPKEY } }
      );

      setRulesList([...tempRulesList]);
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating rules:", error);
      alert("Failed to update rules. Please try again.");
    }
  };

  const handleCancel = () => {
    setTempRulesList(rulesList);
    setIsEditing(null);
  };

  const toggleRule = (ruleId) => {
    setOpenRuleIds(
      (prev) =>
        prev.includes(ruleId)
          ? prev.filter((id) => id !== ruleId) // close
          : [...prev, ruleId] // open
    );
  };

  // --- LUXURIOUS UI START ---

  if (loading) {
    return (
      <div className="space-y-4 w-full p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
        <h2 className="text-xl font-semibold text-amber-400">Ladder Rules</h2>
        <Skeleton className="h-10 w-full bg-gray-700" />
        <Skeleton className="h-24 w-full bg-gray-800" />
      </div>
    );
  }

  return (
    // Outer container takes the dark/glassmorphic style
    <div className="space-y-6 w-full px-6"> 
      {rulesList.map((rule, idx) => {
        const isCurrentEditing = isEditing === rule.id;
        const isOpen = openRuleIds.includes(rule.id);
        return (
          // Individual Rule Card
          <div 
            key={rule.id} 
            className="space-y-3 pb-6 rounded-xl transition-all duration-300"
          >
            {isCurrentEditing ? (
              // --- EDIT MODE ---
              <>
                <Input
                  className="text-xl sm:text-2xl font-bold text-amber-400 w-full bg-gray-800 border-amber-400/50 p-4 rounded-xl shadow-lg focus:ring-amber-500 focus:border-amber-500"
                  value={tempRulesList[idx].title}
                  onChange={(e) => {
                    const newList = [...tempRulesList];
                    newList[idx].title = e.target.value;
                    setTempRulesList(newList);
                  }}
                />
                
                <Textarea
                  className="w-full bg-gray-800 border-gray-700 p-4 font-normal text-gray-200 rounded-xl shadow-inner text-base sm:text-lg whitespace-pre-line break-words max-h-[380px] overflow-y-auto focus:ring-indigo-500 focus:border-indigo-500"
                  rows={6}
                  value={tempRulesList[idx].rules}
                  onChange={(e) => {
                    const newList = [...tempRulesList];
                    newList[idx].rules = e.target.value;
                    setTempRulesList(newList);
                  }}
                  style={{ resize: "vertical" }}
                />

                <div className="flex flex-col sm:flex-row justify-end gap-3 w-full pt-2">
                  <Button
                    onClick={() => handleSave(rule.id)}
                    // Gold Save Button - High Impact
                    className="bg-amber-500 text-gray-900 font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto flex items-center gap-2"
                  >
                    <Save size={18} /> Save
                  </Button>
                  <Button
                    // Subtle Cancel Button
                    variant="ghost" 
                    onClick={handleCancel}
                    className="bg-gray-700 text-gray-300 font-semibold hover:bg-gray-600 transition-all w-full sm:w-auto flex items-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </Button>
                </div>
              </>
            ) : (
              // --- VIEW MODE (Accordion) ---
              <>
                <div 
                  className="text-white bg-gradient-to-r from-[#154052] to-blue-900 rounded-lg font-semibold text-xl  hover cursor-pointer transition  flex items-center justify-between gap-2 p-4 shadow-xl  sm:text-2xl "
                  onClick={() => toggleRule(rule.id)} // Clickable header for luxurious accordion effect
                >
                  <span className="break-words mr-4">{rule.title || "Ladder Rules"}</span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-amber-400 hover:bg-gray-900/50"
                  >
                    {isOpen ? (
                      <ChevronUp size={24} className="text-amber-400" />
                    ) : (
                      <ChevronDown size={24} className="text-amber-400" />
                    )}
                  </Button>
                </div>

                {isOpen && (
                  <div className="pt-2">
                    <p className="mt-2 bg-gray-900/70 p-6 font-light text-gray-200 rounded-xl shadow-inner text-base sm:text-lg whitespace-pre-line break-words transition-opacity duration-500 max-h-[380px] overflow-y-auto border border-gray-800">
                      {rule.rules || "No rules available."}
                    </p>
                    <div className="flex flex-col sm:flex-row mt-4 justify-end gap-3 w-full">
                      <Button
                        // Primary Action: Edit Info (Red/Accent for Admin function)
                        className="bg-blue-900 text-white cursor-pointer font-semibold hover:bg-blue-950 transition-all shadow-lg w-full sm:w-auto flex items-center gap-2"
                        onClick={() => setIsEditing(rule.id)}
                      >
                        <Edit size={18} /> Edit Info
                      </Button>

                      {idx === rulesList.length - 1 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            {/* Secondary Action: Ideas for Rules (Indigo/Blue Accent) */}
                            <Button className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg w-full sm:w-auto">
                              Ideas For Rules
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[90vh] w-full sm:max-w-3xl md:max-w-4xl overflow-y-auto px-4 bg-gray-900 border-gray-700 text-gray-100">
                            <DialogHeader>
                              <DialogTitle className="text-lg sm:text-xl text-amber-400 font-bold">
                                RULES FOR LADDER
                              </DialogTitle>
                            </DialogHeader>
                            <div>
                              <RulesForLadder />
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LadderRulesCard;