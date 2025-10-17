"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard, uploadCSV } from "@/redux/slices/leaderboardSlice";
import { fetchGradebars } from "@/redux/slices/gradebarSlice";
import { EditPlayer } from "@/components/shared/EditPlayer";
import PlayerSearch from "./PlayerSearch";
import { motion } from "framer-motion";
import AvailableLabel from "@/components/shared/AvailableLabel";
import { resetLeaderboard } from "@/redux/slices/resetLeaderboardSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PlayersList({ ladderId }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

   const lastUploadedFile = useSelector(
    (state) => state.player?.lastUploadedFile || null
  );
  // const moveLoading = useSelector((state) => state.playerMoving?.loading);
  // const resetLoading = useSelector((state) => state.resetLeaderboard?.loading);

  // ✅ Subscription limit
  const subscription = useSelector(
    (state) => state.player?.players[ladderId]?.ladderDetails
  );
  const [allowedUsers, setAllowedUsers] = useState(10);

  useEffect(() => {
    const baseUsers = 10; // default

    if (subscription) {
      const expiry = new Date(subscription?.subscription_expired_date); // backend se aa rha hai
      const now = new Date();

      if (expiry > now) {
        // subscription active
        const extraUsers = subscription?.no_of_users
          ? Number(subscription.no_of_users)
          : 0;
        setAllowedUsers(baseUsers + extraUsers);
      } else {
        // subscription expired
        setAllowedUsers(baseUsers);
      }
    } else {
      // कोई subscription नहीं
      setAllowedUsers(baseUsers);
    }
  }, [subscription]);

  const user = useSelector((state) => state.user.user);

  const players = useSelector(
    (state) => state.player?.players?.[ladderId]?.data || []
  );
  const preset = useSelector((state) => state.gradebar?.preset || 10);
  const gradebarDetails = useSelector(
    (state) => state.gradebar?.gradebarDetails || []
  );

  // ✅ Fetch leaderboard + gradebars
  useEffect(() => {
    if (ladderId) {
      dispatch(fetchLeaderboard({ ladder_id: ladderId }));
      dispatch(fetchGradebars(ladderId));
    }
  }, [dispatch, ladderId]);

  // ✅ Search filter
  const filteredPlayers = searchTerm
    ? players.filter((p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : players;

  // ✅ Group by preset
  const generateGrades = (playersArr, gradebarDetails, preset) => {
    if (!playersArr || playersArr.length === 0) return [];
    const groupSize = Number(preset) || 10;
    const out = [];

    for (let i = 0; i < playersArr.length; i += groupSize) {
      const groupPlayers = playersArr.slice(i, i + groupSize);
      const gradeIdx = Math.floor(i / groupSize);
      const gradeLabel =
        gradebarDetails?.[gradeIdx]?.gradebar_name || `SECTION ${gradeIdx + 1}`;

      out.push({
        label: gradeLabel,
        players: groupPlayers,
      });
    }
    return out;
  };

  const grades = generateGrades(filteredPlayers, gradebarDetails, preset);

  // ✅ Player click handler
  const handlePlayerClick = (player, globalIndex, isAllowed) => {
    if (!user) {
      setDialogMessage("Please login first");
      setIsDialogOpen(true);
      return;
    }

    if (!isAllowed) {
      toast.warning("Upgrade your subscription to access more players.");
      return;
    }

    if (
      user?.user_type?.toLowerCase() === "admin" ||
      String(user?.id) === String(player.id)
    ) {
      setSelectedPlayerId(player.id);
      setIsModalOpen(true);
    } else {
      setDialogMessage("You can only edit your own profile");
      setIsDialogOpen(true);
    }
  };

    // Auto login Joe (demo)
  useEffect(() => {
    if (!user) {
      dispatch({
        type: "user/setUser",
        payload: {
          id: "999",
          name: "Joe Bloggs",
          email: "joebloggs@gmail.com",
          user_type: "user",
          player_status: "1",
        },
      });
    }
  }, [user, dispatch]);

    // ✅ Reset leaderboard
  const handleReset = async () => {
    try {
      const resetPayload = { ladder_id: ladderId };
      await dispatch(resetLeaderboard(resetPayload)).unwrap();

      let fileToUpload = lastUploadedFile;
      if (!fileToUpload) {
        const response = await fetch("/leaderboard1.csv");
        const fileBlob = await response.blob();
        fileToUpload = new File([fileBlob], "leaderboard1.csv", {
          type: "text/csv",
        });
      }
      await dispatch(uploadCSV({ file: fileToUpload, ladder_id: ladderId })).unwrap();

      await dispatch(fetchLeaderboard({ ladder_id: ladderId }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4">
        {/* <PlayerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
      </div>


      {/* ========================= joebloggs  */}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4">
        <PlayerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* ✅ Show Reset button only for Joe Boggs */}

        {user?.name === "Joe Bloggs" && user?.user_id === "joebloggs@gmail.com" && (
          <Button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Reset
          </Button>
        )}

      </div>

      {grades.map((grade, gradeIndex) => (
        <div key={gradeIndex} className="mb-8">
          <div className="flex items-center gap-8">
            <Badge className="bg-red-600 rounded-md py-2 px-6 text-md font-semibold uppercase">
              {grade.label}
            </Badge>
            {gradeIndex === 0 && <AvailableLabel />}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 mt-4">
            {grade.players.length > 0 ? (
              grade.players.map((player, pidx) => {
                const globalIndex = gradeIndex * (Number(preset) || 10) + pidx;
                const isCurrentUser = String(user?.id) === String(player.id);

                // ✅ Allowed condition: within subscription OR current user
                const isAdmin = user?.user_type?.toLowerCase() === "admin";
                const isAllowed = globalIndex < allowedUsers || isAdmin;

                const canEdit =
                  user?.user_type?.toLowerCase() === "admin" || isCurrentUser;

                const playerImageUrl = player.image
                  ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${
                      player.image
                    }?t=${Date.now()}`
                  : "/logo.jpg";

                // ✅ Background color logic
                let bgColor = "bg-blue-100 dark:bg-gray-800"; // inactive default

                if (isCurrentUser && globalIndex < allowedUsers) {
                  bgColor = "bg-yellow-300"; // ✅ login user सिर्फ limit के अंदर हो तो yellow
                } else if (String(player.player_status) === "1" && isAllowed) {
                  bgColor = "bg-green-400"; // ✅ active players (within limit / admin)
                }

                return (
                  <motion.div
                    key={player.id || pidx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: pidx * 0.03 }}
                  >
                    <div
                      onClick={() =>
                        handlePlayerClick(player, globalIndex, isAllowed)
                      }
                      className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
                        ${bgColor}
                        ${
                          isAllowed && canEdit
                            ? "cursor-pointer hover:scale-[1.01]"
                            : "cursor-not-allowed opacity-70"
                        }`}
                    >
                      <div className="flex items-center w-full gap-3">
                        <p className="text-sm font-bold text-gray-700">
                          {player.rank}
                        </p>
                        <img
                          src={playerImageUrl}
                          className="rounded-full w-12 h-12 object-cover border border-gray-300"
                          width={48}
                          height={48}
                          alt={`Player ${player.name}`}
                        />
                        <div className="flex flex-col flex-1 min-w-0">
                          <p
                            className="text-md font-semibold truncate text-gray-900"
                            title={player.name}
                          >
                            {player.name}
                          </p>
                          <p className="text-sm" title={player.phone}>
                            {player.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No players found
              </p>
            )}
          </div>
        </div>
      ))}

      {isModalOpen && (
        <EditPlayer
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentId={selectedPlayerId}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
          </DialogHeader>
          <p className="py-2">{dialogMessage}</p>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
