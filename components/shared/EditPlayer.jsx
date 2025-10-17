

// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
// import { useDispatch, useSelector } from "react-redux";
// import { clearMoveResult } from "@/redux/slices/playerMovingSlice";
// import { toast } from "react-toastify";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
// import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
// import { Skeleton } from "@/components/ui/skeleton";
// import PlayerStatsBoxUser from "./PlayerStatsBoxUser";

// import ChallengeNumberInput from "./ChallengeNumberInput";
// import MoveNumberInput from "./MoveNumberInput";
// import EditPlayerDetails from "./EditPlayerDetails";
// import PlayerImage from "./PlayerImage";
// import StatusPlayer from "./StatusPlayer";

// import { clearStatusMessage } from "@/redux/slices/playerStatusSlice";
// import { resetProfileImageState } from "@/redux/slices/profileImageSlice";

// export const EditPlayer = ({
//   open = true,
//   onClose = () => {},
//   currentId = null,
//   setLoading = () => {},
// }) => {
//   const dispatch = useDispatch();

//   const user = useSelector((state) => state?.user?.user || {});
//   const ladder_id = user?.ladder_id;

//   const players =
//     useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];

//   const selectedPlayer = useMemo(
//     () => players.find((p) => p.id === Number(currentId)),
//     [players, currentId]
//   );

//   const moving = useSelector((s) => s?.playerMoving) || {};
//   const status = useSelector((s) => s?.playerStatus) || {};
//   const image = useSelector((s) => s?.profileImage) || {};

//   const [activeTab, setActiveTab] = useState("move");
//   const [challengedPlayer, setChallengedPlayer] = useState("");
//   const [showEditSkeleton, setShowEditSkeleton] = useState(false);

//   useEffect(() => {
//     if (open && ladder_id) {
//       dispatch(fetchLeaderboard({ ladder_id }));
//     }
//   }, [dispatch, ladder_id, open]);

//   useEffect(() => {
//     let didSomething = false;

//     if (moving?.result?.success_message) {
//       didSomething = true;
//       dispatch(clearMoveResult());
//     }
//     if (moving?.error) {
//       toast.error(moving.error);
//       dispatch(clearMoveResult());
//     }

//     if (status?.successMessage) {
//       didSomething = true;
//       dispatch(clearStatusMessage());
//     }
//     if (status?.error) {
//       toast.error(status.error);
//       dispatch(clearStatusMessage());
//     }

//     if (image?.success) {
//       didSomething = true;
//       dispatch(resetProfileImageState());
//     }
//     if (image?.error) {
//       toast.error(image.error);
//       dispatch(resetProfileImageState());
//     }

//     if (didSomething && ladder_id) {
//       dispatch(fetchLeaderboard({ ladder_id }));
//     }
//   }, [moving, status, image, dispatch, ladder_id]);

//   useEffect(() => {
//     if (activeTab === "edit") {
//       setShowEditSkeleton(true);
//       const t = setTimeout(() => setShowEditSkeleton(false), 800);
//       return () => clearTimeout(t);
//     }
//   }, [activeTab]);

//   const handleChildSuccess = () => {
//     if (ladder_id) dispatch(fetchLeaderboard({ ladder_id }));
//   };

//   const [selectedTab, setSelectedTab] = useState("result");

//   const tabs = [
//     { value: "move", label: "Result" },
//     { value: "status", label: "Status" },
//     { value: "edit", label: "Edit" },
//     { value: "load", label: "Upload" },
//     { value: "stats", label: "Stats" },
//     { value: "challenge", label: "Challenge" },
//   ];

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogTitle>
//           <VisuallyHidden>Edit Player Modal</VisuallyHidden>
//         </DialogTitle>

//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
//               {/* ✅ Desktop / Tablet Tabs */}
//             <div className="">
//               <TabsList className="lg:w-full sm:w-full md:w-full w-80 flex items-center justify-center ">
//                 {tabs.map((tab) => (
//                   <TabsTrigger
//                     key={tab.value}
//                     value={tab.value}
//                     className="data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg  transition-all text-sm sm:text-base"
//                   >
//                     {tab.label}
//                   </TabsTrigger>
//                 ))}
//               </TabsList>
//             </div>


//             {/* ✅ Tab Content */}
//             <TabsContent value="move">
//               <MoveNumberInput
//                 onClose={onClose}
//                 currentId={currentId}
//                 currentRank={selectedPlayer?.rank}
//                 setLoading={setLoading}
//                 selectedPlayer={selectedPlayer}
//               />
//             </TabsContent>

//             <TabsContent value="challenge">
//               <ChallengeNumberInput
//                 selectedPlayer={selectedPlayer}
//                 challengedPlayer={challengedPlayer}
//                 setChallengedPlayer={setChallengedPlayer}
//                 userId={user?.id}
//                 onSuccess={handleChildSuccess}
//               />
//             </TabsContent>

//             <TabsContent value="edit">
//               {showEditSkeleton ? (
//                 <div className="space-y-4">
//                   <Skeleton className="h-10 w-full rounded-xl" />
//                   <Skeleton className="h-10 w-full rounded-xl" />
//                   <Skeleton className="h-10 w-full rounded-xl" />
//                 </div>
//               ) : selectedPlayer ? (
//                 <EditPlayerDetails
//                   initialData={selectedPlayer}
//                   onClose={onClose}
//                   onSuccess={handleChildSuccess}
//                 />
//               ) : (
//                 <p className="text-sm text-muted">Player not found.</p>
//               )}
//             </TabsContent>

//             <TabsContent value="load">
//               <PlayerImage
//                 userId={selectedPlayer?.id}
//                 onSuccess={handleChildSuccess}
//                 onClose={onClose}
//               />
//             </TabsContent>

//             <TabsContent value="status">
//               <StatusPlayer
//                 playerId={selectedPlayer?.id}
//                 onSuccess={handleChildSuccess}
//                 onClose={onClose}
//               />
//             </TabsContent>

//             <TabsContent value="stats">
//               <PlayerStatsBoxUser
//                 userId={selectedPlayer?.id}
//                 ladderId={ladder_id}
//               />
//             </TabsContent>
//           </Tabs>
//         </motion.div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditPlayer;
















// =========================

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { clearMoveResult } from "@/redux/slices/playerMovingSlice";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import { Skeleton } from "@/components/ui/skeleton";
import PlayerStatsBoxUser from "./PlayerStatsBoxUser";

import ChallengeNumberInput from "./ChallengeNumberInput";
import MoveNumberInput from "./MoveNumberInput";
import EditPlayerDetails from "./EditPlayerDetails";
import PlayerImage from "./PlayerImage";
import StatusPlayer from "./StatusPlayer";

import { clearStatusMessage } from "@/redux/slices/playerStatusSlice";
import { resetProfileImageState } from "@/redux/slices/profileImageSlice";
import PlayerBet from "../pages/players/PlayerBet";

export const EditPlayer = ({
  open = true,
  onClose = () => {},
  currentId = null,
  setLoading = () => {},
}) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.user?.user || {});
  const ladder_id = user?.ladder_id;

  const players = useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];

  const selectedPlayer = useMemo(
    () => players.find((p) => p.id === Number(currentId)),
    [players, currentId]
  );

  const moving = useSelector((s) => s?.playerMoving) || {};
  const status = useSelector((s) => s?.playerStatus) || {};
  const image = useSelector((s) => s?.profileImage) || {};

  const [activeTab, setActiveTab] = useState("move");
  const [challengedPlayer, setChallengedPlayer] = useState("");
  const [showEditSkeleton, setShowEditSkeleton] = useState(false);
  const [selectedTab, setSelectedTab] = useState("result");

  useEffect(() => {
    if (open && ladder_id) {
      dispatch(fetchLeaderboard({ ladder_id }));
    }
  }, [dispatch, ladder_id, open]);

  useEffect(() => {
    let didSomething = false;

    if (moving?.result?.success_message) {
      didSomething = true;
      dispatch(clearMoveResult());
    }
    if (moving?.error) {
      toast.error(moving.error);
      dispatch(clearMoveResult());
    }

    if (status?.successMessage) {
      didSomething = true;
      dispatch(clearStatusMessage());
    }
    if (status?.error) {
      toast.error(status.error);
      dispatch(clearStatusMessage());
    }

    if (image?.success) {
      didSomething = true;
      dispatch(resetProfileImageState());
    }
    if (image?.error) {
      toast.error(image.error);
      dispatch(resetProfileImageState());
    }

    if (didSomething && ladder_id) {
      dispatch(fetchLeaderboard({ ladder_id }));
    }
  }, [moving, status, image, dispatch, ladder_id]);

  useEffect(() => {
    if (activeTab === "edit") {
      setShowEditSkeleton(true);
      const t = setTimeout(() => setShowEditSkeleton(false), 800);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  const handleChildSuccess = () => {
    if (ladder_id) dispatch(fetchLeaderboard({ ladder_id }));
  };

  const tabs = [
    { value: "move", label: "Result" },
    { value: "status", label: "Status" },
    { value: "edit", label: "Edit" },
    { value: "load", label: "Upload" },
    { value: "stats", label: "Stats" },
     { value: "bet", label: "Bet" },
    { value: "challenge", label: "Challenge" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 text-white border border-white/10">
        <DialogTitle>
          <VisuallyHidden>Edit Player Modal</VisuallyHidden>
        </DialogTitle>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tabs header */}
            <div>
              <TabsList className="lg:w-full sm:w-full md:w-full w-80 flex items-center justify-center bg-white/10 border border-white/10">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-white/80 hover:text-white rounded-lg transition-all text-sm sm:text-base"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab content */}
            <TabsContent value="move" className="mt-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <MoveNumberInput
                  onClose={onClose}
                  currentId={currentId}
                  currentRank={selectedPlayer?.rank}
                  setLoading={setLoading}
                  selectedPlayer={selectedPlayer}
                />
              </div>
            </TabsContent>

            <TabsContent value="challenge" className="mt-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <ChallengeNumberInput
                  selectedPlayer={selectedPlayer}
                  challengedPlayer={challengedPlayer}
                  setChallengedPlayer={setChallengedPlayer}
                  userId={user?.id}
                  onSuccess={handleChildSuccess}
                />
              </div>
            </TabsContent>

            <TabsContent value="edit" className="mt-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                {showEditSkeleton ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full rounded-xl bg-white/10" />
                    <Skeleton className="h-10 w-full rounded-xl bg-white/10" />
                    <Skeleton className="h-10 w-full rounded-xl bg-white/10" />
                  </div>
                ) : selectedPlayer ? (
                  <EditPlayerDetails initialData={selectedPlayer} onClose={onClose} onSuccess={handleChildSuccess} />
                ) : (
                  <p className="text-sm text-white/70">Player not found.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="load" className="mt-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <PlayerImage userId={selectedPlayer?.id} onSuccess={handleChildSuccess} onClose={onClose} />
              </div>
            </TabsContent>

            <TabsContent value="status" className="mt-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <StatusPlayer playerId={selectedPlayer?.id} onSuccess={handleChildSuccess} onClose={onClose} />
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <PlayerStatsBoxUser userId={selectedPlayer?.id} ladderId={ladder_id} />
              </div>
            </TabsContent>
             <TabsContent value="bet">
                <PlayerBet ladderId={ladder_id} selectedPlayer={selectedPlayer} />
              </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlayer;
