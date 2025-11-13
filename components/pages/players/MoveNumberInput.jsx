

// "use client";

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import { ArrowLeft, X, CheckCircle, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Checkbox } from "@/components/ui/checkbox";
// import { movePlayer } from "@/redux/slices/playerMovingSlice";
// import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
// import { useSearchParams } from "next/navigation";
// import { fetchUserActivity } from "@/redux/slices/activitySlice";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogFooter,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";

// const MoveNumberInput = ({
//   onClose = () => {},
//   currentId = null,
//   currentRank = null,
//   setLoading,
//   selectedPlayer = {},
// }) => {
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//   const ladder_id = searchParams.get("ladder_id");

//   const [selectedNumber, setSelectedNumber] = useState("");
//   const [localLoading, setLocalLoading] = useState(true);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [resultType, setResultType] = useState(""); // Beat / Lost
//   const [score, setScore] = useState(""); // Best 3 / 5 scores

//   const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

//   // User info
//   const user = useSelector((state) => state?.user?.user || {});
//   const user_id = user?.id;

//   const players =
//     useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];
//   const ladderDetails =
//     useSelector((state) => state.player?.players?.[ladder_id]?.ladderDetails) || {};
//   const ladderType = ladderDetails?.type || "winlose";

//   // Find the player who was challenged (the rank entered in the input)
//   const challengedPlayer =
//     players.find((p) => p.rank === Number(selectedNumber)) || null;

//   useEffect(() => {
//     const timer = setTimeout(() => setLocalLoading(false), 1000); // Reduced delay
//     return () => clearTimeout(timer);
//   }, []);

//   const handleNumberClick = (num) => {
//     // Limit input length for rank for better UI/UX
//     if (selectedNumber.length < 3) {
//         setSelectedNumber((prev) => prev + num);
//     }
//   };
  
//   const handleBackspace = () => setSelectedNumber((prev) => prev.slice(0, -1));
//   const handleCancel = () => onClose();

//   const handleEnter = () => {
//     if (!user_id || !ladder_id || !currentId) {
//       toast.error("Missing required information (User/Ladder/Player ID).");
//       return;
//     }
//     if (!selectedNumber || isNaN(selectedNumber) || Number(selectedNumber) <= 0) {
//       toast.error("Please enter a valid rank number.");
//       return;
//     }
//     if (!resultType) {
//       toast.error("Please select 'Beat' or 'Lost to'.");
//       return;
//     }
//     if ((ladderType === "best3" || ladderType === "best5") && !score) {
//       toast.error("Please select the match score.");
//       return;
//     }

//     // Check if the rank exists in the current ladder
//     if (!challengedPlayer) {
//         toast.error(`Player with rank ${selectedNumber} not found.`);
//         return;
//     }

//     setShowConfirm(true);
//   };

//   const confirmMove = async () => {
//     try {
//       // Close dialog immediately to prevent user interaction while loading
//       setShowConfirm(false);
//       onClose(); 
//       setLoading(true);

//       const payload = {
//         user_id,
//         move_from_user_id: currentId,
//         move_to_rank: Number(selectedNumber),
//         ladder_id,
//         match_status: resultType,
//       };

//       if (ladderType === "best3" || ladderType === "best5") payload.score = score;

//       await dispatch(movePlayer(payload)).unwrap();
      
//       // Refresh data
//       await dispatch(fetchLeaderboard({ ladder_id }));
//       await dispatch(fetchUserActivity({ ladder_id }));

//       toast.success(
//         "Result submitted successfully! Rankings updated.",
//         { autoClose: 2000 }
//       );

//       // Reset state
//       setSelectedNumber("");
//       setResultType("");
//       setScore("");
//     } catch (err) {
//       toast.error(err?.message || "Failed to submit result.");
//     } finally {
//         setLoading(false); // Make sure to reset loading after success/error
//     }
//   };

//   // Score options for best3 / best5
//   const scoreOptions = ladderType === "best3" ? ["2-0", "2-1"] : ["3-0", "3-1", "3-2"];

//   if (localLoading) {
//     return (
//       // Skeleton adapted for dark mode
//       <div className="w-full max-w-lg mx-auto p-4 space-y-6 ">
//         <Skeleton className="h-6 w-3/4 bg-gray-700 rounded-lg" />
//         <Skeleton className="h-10 w-full bg-gray-700 rounded-lg" />
//         <div className="flex gap-4">
//             <Skeleton className="h-8 w-1/2 bg-gray-700 rounded-lg" />
//             <Skeleton className="h-8 w-1/2 bg-gray-700 rounded-lg" />
//         </div>
//         {(ladderType === "best3" || ladderType === "best5") && (
//             <Skeleton className="h-8 w-full bg-gray-700 rounded-lg" />
//         )}
//         <div className="grid grid-cols-3 gap-3">
//           {Array.from({ length: 12 }).map((_, i) => (
//             <Skeleton key={i} className="h-14 w-full bg-gray-700 rounded-lg" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div 
//         layout 
//         className="px-2 md:px-6 py-4 overflow-hidden text-gray-100 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 rounded-md " // Dark mode text
//     >
//       <h3 className="mb-6 text-xl font-bold text-violet-200">
//         Record Match Result
//       </h3>

//       {/* Result Selection */}
//       <div className="mb-4 p-4 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 rounded-lg border border-gray-700 shadow-md">
//         <p className="text-lg font-medium mb-3 text-gray-300">
//           Select the Match Outcome
//         </p>
        
//         <div className="flex items-center h-2 gap-6 ">
//           {/* Beat Checkbox */}
//           <div className="flex items-center gap-2">
//             <Checkbox
//               id="beat"
//               checked={resultType === "beat"}
//               onCheckedChange={(val) => setResultType(val ? "beat" : "")}
//               className="border-green-300 data-[state=checked]:bg-green-500 data-[state=checked]:text-white w-5 h-5"
//             />
//             <label htmlFor="beat" className="text-base font-medium cursor-pointer hover:text-green-400 transition-colors">
//               Beat (Move Up)
//             </label>
//           </div>
          
//           {/* Lost Checkbox */}
//           <div className="flex items-center gap-2 ">
//             <Checkbox
//               id="lost"
//               checked={resultType === "lost"}
//               onCheckedChange={(val) => setResultType(val ? "lost" : "")}
//               className="border-red-400 data-[state=checked]:bg-red-500 data-[state=checked]:text-white w-5 h-5"
//             />
//             <label htmlFor="lost" className="text-base font-medium cursor-pointer hover:text-red-300 transition-colors">
//               Lost (Move Down)
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Score selection for Best 3 / Best 5 */}
//       {(ladderType === "best3" || ladderType === "best5") && (
//         <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
//             <p className="text-sm font-medium mb-3 text-gray-300">
//               Select the Final Score ({ladderType === "best3" ? "Best of 3" : "Best of 5"}):
//             </p>
//             <div className="flex items-center gap-6 flex-wrap">
//               {scoreOptions.map((s) => (
//                 <div key={s} className="flex items-center gap-2">
//                   <Checkbox
//                     id={s}
//                     checked={score === s}
//                     onCheckedChange={(val) => setScore(val ? s : "")}
//                     className="border-violet-500 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white"
//                   />
//                   <label htmlFor={s} className="text-base font-medium cursor-pointer hover:text-violet-400 transition-colors">
//                     {s}
//                   </label>
//                 </div>
//               ))}
//             </div>
//         </div>
//       )}

//       {/* Rank Input and Numpad */}
//       <div className="flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 md:flex-row gap-6 items-center md:items-start p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl">
        
//         <div className="flex-1 w-full max-w-xs md:max-w-none">
//             <p className="text-lg font-medium mb-2 text-gray-300">
//                Enter Challenged Player's Rank
//             </p>
//             <Input
//                 value={selectedNumber}
//                 readOnly
//                 placeholder="---"
//                 className="mb-4 text-4xl text-center font-mono w-56 bg-gray-900 border-violet-500 text-violet-400 tracking-widest shadow-inner rounded-xl"
//             />
//              {challengedPlayer && (
//                 <p className="text-xl text-gray-100 mt-2">
//                     Player : <span className="font-semibold text-white">{challengedPlayer.name}</span>
//                 </p>
//              )}
//         </div>

//         {/* Numpad */}
//         <div className="flex-1 w-full max-w-xs grid grid-cols-3 gap-3">
//           {numberButtons.map((num) => (
//             <motion.button 
//                 key={num} 
//                 onClick={() => handleNumberClick(num)}
//                 whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)" }}
//                 whileTap={{ scale: 0.95 }}
//                 className="h-8 w-full bg-gray-700 text-gray-100 hover:bg-violet-600 transition-all duration-200 text-xl font-bold rounded-xl shadow-lg border border-gray-600"
//             >
//               {num}
//             </motion.button>
//           ))}
//         </div>
//       </div>
      
//       {/* Action Buttons */}
//       <div className="flex gap-3 mt-6">
//         <Button 
//             variant="outline" 
//             onClick={handleBackspace}
//             className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600 transition-all"
//         >
//           <ArrowLeft className="w-4 h-4 mr-1" /> Backspace
//         </Button>
//         <Button 
//             variant="destructive" 
//             onClick={handleCancel} 
//             className="flex-1 bg-red-600 hover:bg-red-700 transition-all text-white"
//         >
//           <X className="w-4 h-4 mr-1" /> Cancel
//         </Button>
//         <Button
//           onClick={handleEnter}
//           disabled={!selectedNumber || !resultType}
//           // Premium Violet Gradient
//           className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <CheckCircle className="w-4 h-4 mr-1" /> Post Result
//         </Button>
//       </div>

//       {/* Confirm Dialog (Styled for Dark Mode) */}
//       <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
//         <AlertDialogContent className="bg-gray-900 border-violet-500 text-gray-100">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-2xl font-bold text-violet-400 flex items-center gap-2">
//                 <CheckCircle className="text-green-500 h-6 w-6" /> Confirm Match Result
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-gray-300 mt-4 leading-relaxed">
//                 {/* Dynamic Content based on resultType */}
//                 {resultType === "beat" ? (
//                     <p>
//                         You are reporting that <span className="font-bold text-green-400">{selectedPlayer?.name || "You"}</span> (Current Rank: {currentRank})
//                         **beat** the player ranked **#{selectedNumber}** ({challengedPlayer?.name || "Opponent"}) 
//                         {score && <> with a score of <span className="font-bold text-yellow-400">{score}</span></>}.
//                         If confirmed, your rank will be updated.
//                     </p>
//                 ) : (
//                     <p>
//                         You are reporting that <span className="font-bold text-red-400">{selectedPlayer?.name || "You"}</span> (Current Rank: {currentRank})
//                         **lost** to the player ranked **#{selectedNumber}** ({challengedPlayer?.name || "Opponent"}) 
//                         {score && <> with a score of <span className="font-bold text-yellow-400">{score}</span></>}.
//                         If confirmed, your current rank will remain or adjust based on ladder rules.
//                     </p>
//                 )}
//                 <p className="mt-4 font-semibold text-sm text-yellow-500">
//                     Please ensure the result is correct before confirming.
//                 </p>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className="mt-6">
//             <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600">
//               Go Back
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmMove}
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-all"
//             >
//               Confirm & Post
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>


//     </motion.div>
//   );
// };

// export default MoveNumberInput;







// ==================================================



"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { movePlayer } from "@/redux/slices/playerMovingSlice";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import { useSearchParams } from "next/navigation";
import { fetchUserActivity } from "@/redux/slices/activitySlice";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * Props:
 * - onClose: () => void
 * - currentId: number|string
 * - currentRank: number|string
 * - setLoading: (bool) => void
 * - selectedPlayer: object
 * - onMoveSubmit?: async function(payload) -> optional (if provided used instead of dispatching movePlayer)
 */
const MoveNumberInput = ({
  onClose = () => {},
  currentId = null,
  currentRank = null,
  setLoading = () => {},
  selectedPlayer = {},
  onMoveSubmit = null,
}) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const ladder_id = searchParams.get("ladder_id");

  const [selectedNumber, setSelectedNumber] = useState("");
  const [localLoading, setLocalLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInvalidDialog, setShowInvalidDialog] = useState(false);
  const [resultType, setResultType] = useState(""); // "beat" or "lost"
  const [score, setScore] = useState("");
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });

  const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  // redux user and ladder data:
  const user = useSelector((state) => state?.user?.user || {});
  const user_id = user?.id;

  const players = useSelector(
    (state) => state.player?.players?.[ladder_id]?.data
  ) || [];
  const ladderDetails =
    useSelector(
      (state) => state.player?.players?.[ladder_id]?.ladderDetails
    ) || {};
  const ladderType = ladderDetails?.type || "winlose";

  // the player corresponding to entered rank (challenged target)
  const challengedPlayer =
    players.find((p) => p.rank === Number(selectedNumber)) || null;

  useEffect(() => {
    const timer = setTimeout(() => setLocalLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleNumberClick = (num) => {
    // limit length to 3 digits for ranks (adjust if needed)
    if (selectedNumber.length < 3) setSelectedNumber((prev) => prev + num);
  };
  const handleBackspace = () => setSelectedNumber((prev) => prev.slice(0, -1));
  const handleCancel = () => onClose();

  const validateBeforeConfirm = () => {
    // basic required checks
    if (!user_id || !ladder_id || !currentId) {
      setErrorDialog({
        open: true,
        message: "Missing required data: user, ladder or current player.",
      });
      return false;
    }

    if (!selectedNumber || isNaN(selectedNumber) || Number(selectedNumber) <= 0) {
      setErrorDialog({
        open: true,
        message: "Please enter a valid rank number.",
      });
      return false;
    }

    if (!resultType) {
      setErrorDialog({
        open: true,
        message: "Please select whether you Beat or Lost to the opponent.",
      });
      return false;
    }

    if ((ladderType === "best3" || ladderType === "best5") && !score) {
      setErrorDialog({
        open: true,
        message: "Please select the match score for Best-of ladder types.",
      });
      return false;
    }

    // ensure challenged rank exists
    if (!challengedPlayer) {
      setErrorDialog({
        open: true,
        message: `No player found with rank ${selectedNumber}.`,
      });
      return false;
    }

    // disallow lower-ranked challenges (based on your earlier logic)
    // Higher-ranked players can't challenge or lose to lower-ranked players
    // (In your previous logic: if currentRankNum < selectedNumber -> invalid)
    let currentRankNum = Number(currentRank) || 0;
    if (!currentRankNum) {
      const found = players.find((p) => p.id === currentId);
      currentRankNum = Number(found?.rank) || 0;
    }
    if (currentRankNum < Number(selectedNumber)) {
      setShowInvalidDialog(true);
      return false;
    }

    return true;
  };

  const handleEnter = () => {
    // validate and then open confirmation
    if (validateBeforeConfirm()) {
      setShowConfirm(true);
    }
  };

  const confirmMove = async () => {
    // will either call onMoveSubmit (if provided) or dispatch movePlayer
    setShowConfirm(false);
    onClose();
    setLoading(true);

    const payload = {
      user_id,
      move_from_user_id: currentId,
      move_to_rank: Number(selectedNumber),
      ladder_id,
      match_status: resultType,
    };
    if (ladderType === "best3" || ladderType === "best5") payload.score = score;

    try {
      if (onMoveSubmit && typeof onMoveSubmit === "function") {
        // allow parent to handle the move; expect it to be async
        await onMoveSubmit(payload);
      } else {
        // fallback to redux action (existing behavior)
        await dispatch(movePlayer(payload)).unwrap();
      }

      // refresh leaderboard and activity (if present)
      try {
        await dispatch(fetchLeaderboard({ ladder_id }));
        await dispatch(fetchUserActivity({ ladder_id }));
      } catch (e) {
        // non-fatal: still proceed (no toasts)
        console.error("fetch refresh error", e);
      }

      // reset UI state
      setSelectedNumber("");
      setResultType("");
      setScore("");
      setErrorDialog({ open: false, message: "" });
      setShowInvalidDialog(false);
    } catch (err) {
      // Show error via dialog
      setErrorDialog({
        open: true,
        message:
          err?.message ||
          "Failed to submit result. Please try again or contact admin.",
      });
    } finally {
      setLoading(false);
    }
  };

  // score options for best3 / best5
  const scoreOptions = ladderType === "best3" ? ["2-0", "2-1"] : ["3-0", "3-1", "3-2"];

  if (localLoading) {
    return (
      <div className="w-full max-w-lg mx-auto p-4 space-y-6 ">
        <Skeleton className="h-6 w-3/4 bg-gray-700 rounded-lg" />
        <Skeleton className="h-10 w-full bg-gray-700 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-1/2 bg-gray-700 rounded-lg" />
          <Skeleton className="h-8 w-1/2 bg-gray-700 rounded-lg" />
        </div>
        {(ladderType === "best3" || ladderType === "best5") && (
          <Skeleton className="h-8 w-full bg-gray-700 rounded-lg" />
        )}
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="px-2 md:px-6 py-4 overflow-hidden text-gray-100 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 rounded-md"
    >
      <h3 className="mb-6 text-xl font-bold text-violet-200">Record Match Result</h3>

      {/* Result Selection */}
      <div className="mb-4 p-4 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 rounded-lg border border-gray-700 shadow-md">
        <p className="text-lg font-medium mb-3 text-gray-300">Select the Match Outcome</p>

        <div className="flex items-center h-2 gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="beat"
              checked={resultType === "beat"}
              onCheckedChange={(val) => setResultType(val ? "beat" : "")}
              className="border-green-300 data-[state=checked]:bg-green-500 data-[state=checked]:text-white w-5 h-5"
            />
            <label htmlFor="beat" className="text-base font-medium cursor-pointer hover:text-green-400 transition-colors">
              Beat (Move Up)
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="lost"
              checked={resultType === "lost"}
              onCheckedChange={(val) => setResultType(val ? "lost" : "")}
              className="border-red-400 data-[state=checked]:bg-red-500 data-[state=checked]:text-white w-5 h-5"
            />
            <label htmlFor="lost" className="text-base font-medium cursor-pointer hover:text-red-300 transition-colors">
              Lost (Move Down)
            </label>
          </div>
        </div>
      </div>

      {/* Score selection for Best 3 / Best 5 */}
      {(ladderType === "best3" || ladderType === "best5") && (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
          <p className="text-sm font-medium mb-3 text-gray-300">
            Select the Final Score ({ladderType === "best3" ? "Best of 3" : "Best of 5"}):
          </p>
          <div className="flex items-center gap-6 flex-wrap">
            {scoreOptions.map((s) => (
              <div key={s} className="flex items-center gap-2">
                <Checkbox
                  id={s}
                  checked={score === s}
                  onCheckedChange={(val) => setScore(val ? s : "")}
                  className="border-violet-500 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white"
                />
                <label htmlFor={s} className="text-base font-medium cursor-pointer hover:text-violet-400 transition-colors">
                  {s}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rank Input and Numpad */}
      <div className="flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 md:flex-row gap-6 items-center md:items-start p-4 rounded-xl border border-gray-700 shadow-2xl">
        <div className="flex-1 w-full max-w-xs md:max-w-none">
          <p className="text-lg font-medium mb-2 text-gray-300">Enter Challenged Player's Rank</p>
          <Input
            value={selectedNumber}
            readOnly
            placeholder="---"
            className="mb-4 text-4xl text-center font-mono w-56 bg-gray-900 border-violet-500 text-violet-400 tracking-widest shadow-inner rounded-xl"
          />
          {challengedPlayer && (
            <p className="text-xl text-gray-100 mt-2">
              Player: <span className="font-semibold text-white">{challengedPlayer.name}</span>
            </p>
          )}
        </div>

        {/* Numpad */}
        <div className="flex-1 w-full max-w-xs grid grid-cols-3 gap-3">
          {numberButtons.map((num) => (
            <motion.button
              key={num}
              onClick={() => handleNumberClick(num)}
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="h-12 w-full bg-gray-700 text-gray-100 hover:bg-violet-600 transition-all duration-200 text-xl font-bold rounded-xl shadow-lg border border-gray-600"
            >
              {num}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={handleBackspace} className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600 transition-all">
          <ArrowLeft className="w-4 h-4 mr-1" /> Backspace
        </Button>
        <Button variant="destructive" onClick={handleCancel} className="flex-1 bg-red-600 hover:bg-red-700 transition-all text-white">
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button
          onClick={handleEnter}
          disabled={!selectedNumber || !resultType}
          className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4 mr-1" /> Post Result
        </Button>
      </div>

      {/* Invalid Move Dialog (Higher-ranked can't challenge lower-ranked) */}
      <AlertDialog open={showInvalidDialog} onOpenChange={setShowInvalidDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Not Allowed</AlertDialogTitle>
            <AlertDialogDescription>
              Higher-ranked players cannot challenge or lose to lower-ranked players.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowInvalidDialog(false)} className="bg-blue-600 hover:bg-blue-700">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Result Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="bg-gray-900 border-violet-500 text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-violet-400 flex items-center gap-2">
              <CheckCircle className="text-green-500 h-6 w-6" /> Confirm Match Result
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="px-4 pb-4 text-gray-300 leading-relaxed">
            {resultType === "beat" ? (
              <p>
                You are reporting that <span className="font-bold text-green-400">{selectedPlayer?.name || "You"}</span>{" "}
                beat the player ranked <span className="font-semibold">#{selectedNumber}</span>{" "}
                <span className="font-medium text-white">({challengedPlayer?.name || "opponent"})</span>
                {score && (
                  <>
                    {" "}
                    with a score of <span className="font-bold text-yellow-400">{score}</span>
                  </>
                )}
                . If confirmed, rankings will be updated.
              </p>
            ) : (
              <p>
                You are reporting that <span className="font-bold text-red-400">{selectedPlayer?.name || "You"}</span>{" "}
                lost to the player ranked <span className="font-semibold">#{selectedNumber}</span>{" "}
                <span className="font-medium text-white">({challengedPlayer?.name || "opponent"})</span>
                {score && (
                  <>
                    {" "}
                    with a score of <span className="font-bold text-yellow-400">{score}</span>
                  </>
                )}
                . Confirm to submit the result.
              </p>
            )}

            <p className="mt-4 font-semibold text-sm text-yellow-500">Please ensure the result is correct before confirming.</p>
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600">Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMove} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              Confirm & Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog (generic) */}
      <Dialog
        open={errorDialog.open}
        onOpenChange={(open) => setErrorDialog({ open, message: "" })}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-black">Error</DialogTitle>
            <DialogDescription>{errorDialog.message}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setErrorDialog({ open: false, message: "" })} className="bg-red-500 hover:bg-red-600 text-white">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MoveNumberInput;
