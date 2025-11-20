

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// Import Select components for Mobile Tabs
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { movePlayer, clearMoveResult } from "@/redux/slices/playerMovingSlice";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import ChallengeNumberInput from "./ChallengeNumberInput";
import MoveNumberInput from "./MoveNumberInput";
import EditPlayerDetails from "./EditPlayerDetails";
import PlayerImage from "./PlayerImage";
import StatusPlayer from "./StatusPlayer";
import PlayerStatsBox from "./PlayerStatsBox";
import { ChevronDown } from "lucide-react";

import PlayerBet from "./PlayerBet";

export const EditPlayer = ({
  open = true,
  onClose = () => { },
  currentId = null, // ✅ always pass player.id here
  setLoading = () => { },
}) => {
  const dispatch = useDispatch();

  const playerId = currentId ? Number(currentId) : null;

  const user = useSelector((state) => state?.user?.user || {});
  const ladder_id = user?.ladder_id;

  const players =
    useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];


  const selectedPlayer =
    players.length > 0 && playerId
      ? players.find((p) => Number(p.id) === playerId)
      : null;

  useEffect(() => {
    if (open && ladder_id) {
      dispatch(fetchLeaderboard({ ladder_id }));
    }
  }, [dispatch, ladder_id, open]);

  const { loading, error: moveError, result } =
    useSelector((state) => state?.playerMoving) || {};

  useEffect(() => {
    if (result?.success_message) {
      // toast.success(result.success_message); // Toast is better managed outside the component for global state
      dispatch(clearMoveResult());
    }
    if (moveError) {
      toast.error(moveError);
      dispatch(clearMoveResult());
    }
  }, [result, moveError, dispatch]);

  const [selectedTab, setSelectedTab] = useState("result");

  const tabs = [
    { value: "result", label: "Result" },
    { value: "challenge", label: "Challenge" },
    { value: "status", label: "Status" },
    { value: "stats", label: "Stats" },
    { value: "bet", label: "Bet" },
    { value: "edit", label: "Edit" },
    { value: "load", label: "Upload" },
  ];

  // Function to handle Enter key press (Optional but good practice)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Trigger the default action for the current tab, if any.
      // Not strictly necessary here but useful in forms.
    }
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* ✅ Dark Mode Styling:
        - bg-gray-900 for dark background.
        - border-gray-700 for subtle border.
        - max-w-4xl for larger modal on desktop.
      */}
      <DialogContent 
        className="min-w-full md:min-w-[700px] lg:min-w-[900px] border border-gray-700 bg-gray-900 text-gray-100 rounded-xl max-w-4xl "
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="text-2xl font-bold text-violet-400 border-b border-gray-800 ">
          {selectedPlayer ? `Edit Player: ${selectedPlayer.name} (Rank: ${selectedPlayer.rank})` : "Edit Player"}
        </DialogTitle>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="p-2">
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">

            {/* ---------------------------------------------------------------------------------- */}
            {/* ✅ Tabs List (Desktop/Tablet) */}
            {/* ---------------------------------------------------------------------------------- */}
            <div className="hidden sm:block">
              <TabsList className="w-full flex justify-start h-auto  bg-gray-800 rounded-lg shadow-inner">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    // ✅ Premium Dark Mode Tabs Styling
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 rounded-md transition-all duration-300 
                               data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg 
                               hover:bg-gray-700 hover:text-white"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* ---------------------------------------------------------------------------------- */}
            {/* ✅ Select Dropdown (Mobile View) */}
            {/* ---------------------------------------------------------------------------------- */}
            <div className="sm:hidden mb-4">
              <Select value={selectedTab} onValueChange={setSelectedTab}>
                <SelectTrigger 
                  className="w-full bg-gray-800 text-white border-gray-700 focus:ring-violet-500 focus:border-violet-500 rounded-lg"
                  icon={<ChevronDown className="h-4 w-4 opacity-70" />}
                >
                  <SelectValue placeholder="Select Tab" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {tabs.map((tab) => (
                    <SelectItem 
                      key={tab.value} 
                      value={tab.value}
                      className="hover:bg-violet-600 focus:bg-violet-600 focus:text-white"
                    >
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* ---------------------------------------------------------------------------------- */}
            {/* ✅ Tab Content */}
            {/* ---------------------------------------------------------------------------------- */}
            <div className="mt-4 p-4 bg-gray-800/70 border border-gray-700 rounded-xl shadow-2xl">
              <TabsContent value="result">
                <MoveNumberInput
                  onClose={onClose}
                  currentId={playerId}
                  currentRank={selectedPlayer?.rank}
                  setLoading={setLoading}
                  selectedPlayer={selectedPlayer}
                />
              </TabsContent>

              <TabsContent value="challenge">
                <ChallengeNumberInput
                  selectedPlayer={selectedPlayer}
                  challengedPlayer={""}
                  setChallengedPlayer={() => { }}
                  userId={user?.id}
                />
              </TabsContent>


              <TabsContent value="edit">
                <EditPlayerDetails userId={playerId} onClose={onClose} />
              </TabsContent>

              <TabsContent value="load">
                <PlayerImage userId={playerId} onClose={onClose} />
              </TabsContent>

              <TabsContent value="status">
                <StatusPlayer playerId={playerId} onClose={onClose} />
              </TabsContent>

              <TabsContent value="stats">
                <PlayerStatsBox userId={playerId} ladderId={ladder_id} />
              </TabsContent>

              <TabsContent value="bet">
                <PlayerBet ladderId={ladder_id} selectedPlayer={selectedPlayer} />
              </TabsContent>
            </div>

          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};









// ==========================18===========================




// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
// import { useDispatch, useSelector } from "react-redux";
// import { movePlayer, clearMoveResult } from "@/redux/slices/playerMovingSlice";
// import { toast } from "react-toastify";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
// import ChallengeNumberInput from "./ChallengeNumberInput";
// import MoveNumberInput from "./MoveNumberInput";
// import EditPlayerDetails from "./EditPlayerDetails";
// import PlayerImage from "./PlayerImage";
// import StatusPlayer from "./StatusPlayer";
// import PlayerStatsBox from "./PlayerStatsBox";
// import { ChevronDown } from "lucide-react";
// import PlayerBet from "./PlayerBet";

// export const EditPlayer = ({
//   open = true,
//   onClose = () => {},
//   currentId = null,
//   setLoading = () => {},
// }) => {
//   const dispatch = useDispatch();

//   const playerId = currentId ? Number(currentId) : null;
//   const user = useSelector((state) => state?.user?.user || {});
//   const ladder_id = user?.ladder_id;

//   const players =
//     useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];

//   // Selected player re-computed every time ID changes
//   const selectedPlayer = useMemo(() => {
//     if (!players || !playerId) return null;
//     return players.find((p) => Number(p.id) === Number(playerId)) || null;
//   }, [players, playerId]);

//   // Re-render leaderboard when modal opens for a player
//   useEffect(() => {
//     if (open && ladder_id && playerId) {
//       dispatch(fetchLeaderboard({ ladder_id }));
//     }
//   }, [open, playerId, ladder_id, dispatch]);

//   // Handle move results
//   const { loading, error: moveError, result } =
//     useSelector((state) => state?.playerMoving) || {};

//   useEffect(() => {
//     if (result?.success_message) {
//       dispatch(clearMoveResult());
//     }
//     if (moveError) {
//       toast.error(moveError);
//       dispatch(clearMoveResult());
//     }
//   }, [result, moveError, dispatch]);

//   const [selectedTab, setSelectedTab] = useState("result");

//   const tabs = [
//     { value: "result", label: "Result" },
//     { value: "challenge", label: "Challenge" },
//     { value: "status", label: "Status" },
//     { value: "stats", label: "Stats" },
//     { value: "bet", label: "Bet" },
//     { value: "edit", label: "Edit" },
//     { value: "load", label: "Upload" },
//   ];

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {}
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent
//         className="min-w-full md:min-w-[700px] lg:min-w-[900px] border border-gray-700 bg-gray-900 text-gray-100 rounded-xl max-w-4xl"
//         onKeyDown={handleKeyDown}
//       >
//         <DialogTitle className="text-2xl font-bold text-violet-400 border-b border-gray-800">
//           {selectedPlayer
//             ? `Edit Player: ${selectedPlayer.name} (Rank: ${selectedPlayer.rank})`
//             : "Edit Player"}
//         </DialogTitle>

//         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="p-2">
//           <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
//             <div className="hidden sm:block">
//               <TabsList className="w-full flex justify-start h-auto bg-gray-800 rounded-lg shadow-inner">
//                 {tabs.map((tab) => (
//                   <TabsTrigger
//                     key={tab.value}
//                     value={tab.value}
//                     className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 rounded-md transition-all duration-300 
//                     data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg 
//                     hover:bg-gray-700 hover:text-white"
//                   >
//                     {tab.label}
//                   </TabsTrigger>
//                 ))}
//               </TabsList>
//             </div>

//             <div className="sm:hidden mb-4">
//               <Select value={selectedTab} onValueChange={setSelectedTab}>
//                 <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700 rounded-lg" icon={<ChevronDown className="h-4 w-4 opacity-70" />}>
//                   <SelectValue placeholder="Select Tab" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-gray-800 text-white border-gray-700">
//                   {tabs.map((tab) => (
//                     <SelectItem key={tab.value} value={tab.value}>
//                       {tab.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="mt-4 p-4 bg-gray-800/70 border border-gray-700 rounded-xl shadow-xl">
//               <TabsContent value="result">
//                 <MoveNumberInput
//                   onClose={onClose}
//                   currentId={playerId}
//                   currentRank={selectedPlayer?.rank}
//                   setLoading={setLoading}
//                   selectedPlayer={selectedPlayer}
//                 />
//               </TabsContent>
//               <TabsContent value="challenge">
//                 <ChallengeNumberInput
//                   selectedPlayer={selectedPlayer}
//                   challengedPlayer={""}
//                   setChallengedPlayer={() => {}}
//                   userId={user?.id}
//                 />
//               </TabsContent>
//               <TabsContent value="edit">
//                 <EditPlayerDetails userId={playerId} onClose={onClose} />
//               </TabsContent>
//               <TabsContent value="load">
//                 <PlayerImage userId={playerId} onClose={onClose} />
//               </TabsContent>
//               <TabsContent value="status">
//                 <StatusPlayer playerId={playerId} onClose={onClose} />
//               </TabsContent>
//               <TabsContent value="stats">
//                 <PlayerStatsBox userId={playerId} ladderId={ladder_id} />
//               </TabsContent>
//               <TabsContent value="bet">
//                 <PlayerBet ladderId={ladder_id} selectedPlayer={selectedPlayer} />
//               </TabsContent>
//             </div>
//           </Tabs>
//         </motion.div>
//       </DialogContent>
//     </Dialog>
//   );
// };















// "use client";
// import React, { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useDispatch } from "react-redux";
// import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";

// export const EditPlayer = ({ open, onClose, currentId, setLoading }) => {
//   const dispatch = useDispatch();
//   const [newName, setNewName] = useState("");
//   const [playerData, setPlayerData] = useState(null);

//   // --- Fetch player details whenever modal opens OR id changes ---
//   useEffect(() => {
//     if (!open || !currentId) return;

//     const fetchPlayer = async () => {
//       try {
//         const res = await fetch(
//           `https://ne-games.com/leaderBoard/api/user/get_player?player_id=${currentId}`
//         );
//         const data = await res.json();

//         if (data?.data) {
//           setPlayerData(data.data);
//           setNewName(data.data.player_name || "");
//         }
//       } catch (err) {
//         console.log("Fetch Player Error:", err);
//       }
//     };

//     fetchPlayer();
//   }, [open, currentId]);

//   // --- Save updated name ---
//   const handleSave = async () => {
//     if (!currentId) return;

//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://ne-games.com/leaderBoard/api/user/update_player?player_id=${currentId}&player_name=${newName}`,
//         { method: "PUT" }
//       );

//       await response.json();

//       dispatch(fetchLeaderboard());
//       onClose();
//     } catch (error) {
//       console.log("Update Error:", error);
//     }
//     setLoading(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit Player Name</DialogTitle>
//         </DialogHeader>

//         {playerData ? (
//           <div className="space-y-4">
//             <input
//               className="w-full border p-2 rounded"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               placeholder="Enter new name"
//             />

//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSave}>Save</Button>
//             </div>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

