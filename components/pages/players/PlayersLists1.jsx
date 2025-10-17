"use client";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo from "@/public/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeaderboard,
  setSelectedPlayer,
} from "@/redux/slices/leaderboardSlice";
import { EditPlayer } from "./EditPlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserProfile } from "@/redux/slices/profileSlice";
import PlayerSearchInput from "./PlayerSearchInput";
import LadderLinkPanel from "./LadderLinkPanel";
import { useRouter, useSearchParams } from "next/navigation";
import AvailableLabel from "@/components/shared/AvailableLabel";
import {
  fetchGradebars,
  resetGradebar,
  updatePrimaryGradebarName,
} from "@/redux/slices/gradebarSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import purchase from "@/public/flash-sale.gif";
import { Button } from "@/components/ui/button";
import { paymentPage } from "@/helper/RouteName";

import { User, Phone } from "lucide-react";

const PlayersLists1 = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const ladderId = searchParams.get("ladder_id");

  const user = useSelector((state) => state.user?.user); // ✅ Actual logged in user
  const subscription = useSelector((state) => state.user?.subscription); // ✅ Subscription data

  // console.log("subscription here : ", subscription)

  const [allowedUsers, setAllowedUsers] = useState(subscription?.no_of_users);

  // useEffect(() => {
  //   const baseUsers = 10; // ✅ Default active users
  //   const extraUsers = subscription?.no_of_users
  //     ? Number(subscription?.no_of_users)
  //     : 0;
  //   setAllowedUsers(baseUsers + extraUsers);
  // }, [subscription]);

  useEffect(() => {
    const baseUsers = 10; // default

    if (subscription) {
      const expiry = new Date(subscription?.subscription_expired_date); // backend से आ रहा है
      console.log("expire date : ", expiry);
      const now = new Date(); // current date yaha mil rha hai

      if (expiry > now) {
        const extraUsers = subscription?.no_of_users
          ? Number(subscription.no_of_users)
          : 0;
        setAllowedUsers(baseUsers + extraUsers);
      } else {
        setAllowedUsers(baseUsers);
      }
    } else {
      // कोई subscription नहीं
      setAllowedUsers(baseUsers);
    }
  }, [subscription]);

  // const ladderId = urlLadderId;
  const { players, selectedPlayer } = useSelector((state) => state.player);
  const { gradebarDetails, gradebar, primaryGradebarName } = useSelector(
    (state) => state.gradebar
  );

  const playerList = players?.[ladderId]?.data || [];
  const [isOpen, setIsOpen] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isProDialogOpen, setIsProDialogOpen] = useState(false);

  // --- grade edit states ---
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [tempGradeName, setTempGradeName] = useState("");
  const [localGradebars, setLocalGradebars] = useState([]);
  const [groupSize, setGroupSize] = useState(5);

  useEffect(() => {
    if (!ladderId) return;
    setLoadingPlayers(true);
    Promise.all([
      dispatch(fetchLeaderboard({ ladder_id: ladderId })),
      dispatch(fetchGradebars(ladderId)),
    ]).finally(() => setLoadingPlayers(false));
  }, [dispatch, ladderId]);

  useEffect(() => {
    if (Array.isArray(gradebarDetails)) setLocalGradebars(gradebarDetails);
    if (gradebar?.preset) setGroupSize(Number(gradebar.preset));
  }, [gradebarDetails, gradebar]);

  useEffect(() => {
    if (user?.id) dispatch(fetchUserProfile(user.id));
  }, [dispatch, user?.id]);

  const filteredPlayers = searchQuery
    ? playerList.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : playerList;

  const uniquePlayers = Array.from(
    new Map(filteredPlayers.map((p) => [p.id, p])).values()
  );

  useEffect(() => {
    dispatch(setSelectedPlayer(null));
  }, [ladderId, dispatch]);

  const generateGrades = (playersArr, gradebars = []) => {
    const size = Number(groupSize) || 5;
    const out = [];
    for (let i = 0; i < playersArr.length; i += size) {
      const group = playersArr.slice(i, i + size);
      const idx = Math.floor(i / size);
      const gb = gradebars[idx];
      out.push({
        label: gb?.gradebar_name || `SECTION ${String.fromCharCode(65 + idx)}`,
        players: group,
        gradebarId: gb?.id ?? `fallback-${idx}`,
        isFallback: !gb?.id,
      });
    }
    return out;
  };

  const handleGradeEdit = (gradebarId, currentName) => {
    setEditingGradeId(gradebarId);
    setTempGradeName(currentName || "");
  };

  const saveGradeName = async (gradebarId, isFallback = false) => {
    if (!tempGradeName.trim()) {
      setEditingGradeId(null);
      return;
    }
    setLocalGradebars((prev) => {
      if (isFallback) {
        return [
          ...prev,
          { id: gradebarId, gradebar_name: tempGradeName.trim() },
        ];
      }
      return prev.map((g) =>
        g.id === gradebarId ? { ...g, gradebar_name: tempGradeName.trim() } : g
      );
    });
    setEditingGradeId(null);

    try {
      if (isFallback) {
        const res = await fetch(
          "https://ne-games.com/leaderBoard/api/user/creategradeBar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              appkey:
                "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
            },
            body: JSON.stringify({
              user_id: user?.id,
              ladder_id: ladderId,
              preset: groupSize,
              gradebar_name: tempGradeName.trim(),
            }),
          }
        );
        const data = await res.json();
        if (data?.status === 200) {
          const created = data.data?.gradebar_details?.[0];
          if (created) {
            setLocalGradebars((prev) =>
              prev.map((g) =>
                g.id === gradebarId
                  ? { id: created.id, gradebar_name: created.gradebar_name }
                  : g
              )
            );
            dispatch(updatePrimaryGradebarName(created.gradebar_name));
          }
          toast.success("Gradebar created successfully!");
        } else toast.error(data?.message || "Failed to create gradebar");
      } else {
        const res = await fetch(
          "https://ne-games.com/leaderBoard/api/user/updateGradebarName",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              appkey:
                "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
            },
            body: JSON.stringify({
              gradebar_details_id: Number(gradebarId),
              name: tempGradeName.trim(),
            }),
          }
        );
        const data = await res.json();
        if (data?.success || data?.status === "success") {
          toast.success("Grade name updated!");
          dispatch(updatePrimaryGradebarName(tempGradeName.trim()));
        } else toast.error(data?.message || "Failed to update grade name");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const handlePresetChange = async (value) => {
    setGroupSize(value);
    if (!ladderId || !user?.id) return;
    try {
      await dispatch(
        resetGradebar({
          user_id: user.id,
          ladder_id: ladderId,
          gradebar_id: gradebar?.id,
          preset: value,
          gradebar_name: primaryGradebarName || "SECTION",
        })
      ).unwrap();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset gradebar!");
    }
  };

  const grades = generateGrades(uniquePlayers, localGradebars);

  // handle purchase
  const handlePurchase = () => {
    router.push(paymentPage);
  };

  return (
    <div id="print-section" className=" space-y-6 relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Dialog for PRO */}
      <Dialog open={isProDialogOpen} onOpenChange={setIsProDialogOpen}>
        <DialogContent className="sm:max-w-md flex items-center justify-center flex-col">
          <div>
            <Image src={purchase} alt="purchase" width={100} height={100} />
          </div>
          <DialogHeader>
            <DialogTitle>Premium Feature</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Please purchase first to unlock the ladder
          </p>

          <div>
            <Button
              onClick={handlePurchase}
              className="cursor-pointer bg-white border text-black hover:bg-red-200"
            >
              Purchase Ladder
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Section */}
      {/* <div className="mb-4 flex items-center gap-2">
        <div htmlFor="groupSize" className="font-bold text-xl w-full text-white bg-gradient-to-r from-[#114153] to-blue-800">
          Edit Sections:
        </div>
        <select
          id="groupSize"
          value={groupSize}
          onChange={(e) => handlePresetChange(Number(e.target.value))}
          className="border rounded px-4 py-1 cursor-pointer "
        >
          {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div> */}


      <div className="mb-4 flex items-center w-sm gap-3 text-white bg-gradient-to-r from-[#114153] to-blue-800 p-1 rounded-lg shadow-lg">
  <div className="font-bold text-xl text-white flex-1 tracking-wide">
    ✨ Edit Sections
  </div>
  <select
    id="groupSize"
    value={groupSize}
    onChange={(e) => handlePresetChange(Number(e.target.value))}
    className=" text-white font-semibold rounded-lg px-4 py-2 cursor-pointer backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
  >
    {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
      <option key={size} value={size} className="text-black">
        {size}
      </option>
    ))}
  </select>
</div>


      {/* ladder link + search */}
      <div className="flex flex-col mb-16 gap-3 sm:flex-col md:flex-row md:items-center md:gap-2 md:justify-between">
        <div>
          {user?.user_type?.toLowerCase() === "admin" && ladderId && (
            <LadderLinkPanel ladderId={ladderId} />
          )}
        </div>
        <div className="w-full text-white md:w-[40%]">
          {playerList.length > 0 && (
            <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
          )}
        </div>
      </div>

      {loadingPlayers ? (
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </CardContent>
      ) : (
        <div className="space-y-8">
          {grades.map((grade, idx) => (
            <div key={`${grade.gradebarId}-${idx}`} className="space-y-2">
              <div className="flex items-center gap-4">
                <h2 className="flex items-center gap-2 font-bold text-black border border-gray-400 px-4 py-1 rounded shadow-sm uppercase ">
                  {editingGradeId === grade.gradebarId ? (
                    <>
                      <input
                        value={tempGradeName}
                        onChange={(e) => setTempGradeName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            saveGradeName(grade.gradebarId, grade.isFallback);
                          if (e.key === "Escape") setEditingGradeId(null);
                        }}
                        className="text-white px-1 rounded"
                        autoFocus
                      />
                      <button
                        onClick={() =>
                          saveGradeName(grade.gradebarId, grade.isFallback)
                        }
                        className="text-white bg-green-600 px-2 py-0.5 rounded"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      {grade.label}
                      {user?.user_type?.toLowerCase() === "admin" && (
                        <button
                          onClick={() =>
                            handleGradeEdit(grade.gradebarId, grade.label)
                          }
                          title="Edit grade name"
                        >
                          ✏️
                        </button>
                      )}
                    </>
                  )}
                </h2>
                {/* {idx === 0 && <AvailableLabel />} */}
              </div>

              <div className="grid gap-4 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
                {grade.players.map((player, pidx) => {
                  const isActive = selectedPlayer?.id === player.id;
                  const canEdit =
                    user?.user_type.toLowerCase() === "admin" ||
                    user?.id === player.user_id;
                  const globalIndex = idx * groupSize + pidx;
                  const isAllowed = globalIndex < allowedUsers;

                  const playerImageUrl = player.image
                    ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${
                        player.image
                      }?t=${Date.now()}`
                    : Logo;

                  return (
                    <motion.div
                      key={player.id || pidx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: pidx * 0.03 }}
                    >
                      <div
                        onClick={() => {
                          if (!isAllowed) {
                            setIsProDialogOpen(true);
                            return;
                          }
                          if (!canEdit) {
                            toast.warning("You may only tap on your name");
                            return;
                          }
                          dispatch(
                            setSelectedPlayer({
                              ...player,
                              ladder_id: ladderId,
                            })
                          );
                          setIsOpen(true);
                        }}
                        className={`relative flex flex-col gap-2 items-center rounded-sm px-4  shadow-md py-4  transition-all
                          ${
                            player.player_status === 1
                              ? "bg-green-700 "
                              : isActive
                              ? "bg-yellow-400"
                              : "bg-red-700 dark:bg-gray-800"
                          }
                          ${
                            isAllowed && canEdit
                              ? "cursor-pointer hover:scale-[1.01]"
                              : "cursor-not-allowed opacity-70 "
                          }`}
                      >
                           <Image
                            src={playerImageUrl}
                            className="rounded-full w-12 h-12 object-cover border border-zinc-300"
                            width={48}
                            height={48}
                            alt={`Player ${player.name}`}
                          />
                        <div className="  flex items-center justify-center gap-4">
                          
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: -10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 10,
                            }}
                            className="absolute top-1 left-2 text-2xl font-extrabold text-white drop-shadow-md"
                          >
                            {player.rank}
                          </motion.div>

                       

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex flex-col flex-1 min-w-0 space-y-1"
                          >
                            {/* Player Name */}
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 10,
                              }}
                              className="flex items-center gap-2"
                            >
                              {/* <User className=" text-indigo-500 w-8 h-8" /> */}
                              <p
                                className="text-base truncate font-semibold  bg-gradient-to-r from-indigo-300 via-purple-100 px-6 rounded-sm"
                                title={player.name}
                              >
                                {player.name}
                              </p>
                            </motion.div>

                            {/* Player Phone */}
                            <div className="flex  justify-center font-semibold items-center gap-2 text-indigo-200 text-md">
                              {/* <Phone className=" text-indigo-200 w-4 h-4" /> */}
                              <p>{player.phone}</p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPlayer && (
        <EditPlayer
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            dispatch(setSelectedPlayer(null));
            if (user?.id) dispatch(fetchUserProfile(user.id));
            if (ladderId) {
              dispatch(fetchLeaderboard({ ladder_id: ladderId }));
              dispatch(fetchGradebars(ladderId));
            }
          }}
          currentId={selectedPlayer?.id}
          setLoading={setMoveLoading}
        />
      )}
    </div>
  );
};

export default PlayersLists1;
