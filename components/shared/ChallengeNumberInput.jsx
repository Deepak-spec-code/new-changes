"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy } from "lucide-react"; 

import { fetchUserByRank } from "@/redux/slices/fetchUserByRank";
import {
  challengeToPlayer,
  resetChallengeStatus,
} from "@/redux/slices/challengeSlice";
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

const Challenge = ({ userId }) => {
  const [challengeNumber, setChallengeNumber] = useState("");
  const [localLoading, setLocalLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();

  const { loading: challengeLoading, error: challengeError } = useSelector(
    (state) => state.challenge
  );

  const { user: challengedPlayer, loading: playerLoading } = useSelector(
    (state) => state.userByRank
  );

  const user = useSelector((state) => state.user?.user || null);
  const ladderId = user?.ladder_id || null;

  useEffect(() => {
    const timer = setTimeout(() => setLocalLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (challengeNumber && ladderId) {
      dispatch(fetchUserByRank({ rank: challengeNumber, ladder_id: ladderId }));
    }
  }, [challengeNumber, ladderId, dispatch]);

  const handleKeyClick = (num) => {
    if (challengeNumber.length < 4) {
      setChallengeNumber((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setChallengeNumber((prev) => prev.slice(0, -1));
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!challengeNumber || !userId) return;
    setShowConfirm(true);
  };

  const confirmChallenge = async () => {
    setShowConfirm(false);
    toast.info("Sending challenge...", { autoClose: 800 });

    try {
      await dispatch(
        challengeToPlayer({
          user_id: userId,
          challenge_to_rank: challengeNumber,
        })
      ).unwrap();

      await dispatch(fetchUserActivity({ ladder_id: ladderId }));
      toast.success(`\u2705 Challenge sent to rank ${challengeNumber}`);
      setChallengeNumber("");
    } catch (err) {
      toast.error(`\u274C ${challengeError || "Something went wrong"}`);
    } finally {
      dispatch(resetChallengeStatus());
    }
  };

  if (localLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="z-50 max-w-md bg-white shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will send a challenge to rank{" "}
              <span className="font-bold text-blue-600">
                {challengeNumber}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-red-100 hover:bg-red-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmChallenge}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div
        layout
        className="w-full max-w-md p-6 border rounded-xl bg-gray-800 dark:bg-gray-900 shadow-lg"
      >
        <form onSubmit={handleOpenConfirm} className="space-y-4">
          <div>
            <h3 className="text-lg text-center font-semibold mb-2">
              I want to challenge number
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={challengeNumber}
                placeholder="Enter Rank"
                readOnly
                className="w-full rounded-none text-center px-3 py-1 border text-lg"
              />
              <Button
                className=" cursor-pointer"
                type="button"
                variant="destructive"
                onClick={() => setChallengeNumber("")}
              >
                Cancel
              </Button>
            </div>
            <p className="text-sm text-center text-gray-200 mt-4 flex flex-col gap-4 items-center justify-center">
              Their number will appear for you to copy & paste into your chosen comms
              <span className="relative font-semibold text-blue-600 border shadow-md px-8 py-1 w-48 text-center text-lg flex items-center justify-center gap-2">
                {playerLoading
                  ? "Loading..."
                  : challengedPlayer?.phone ?? "N/A"}

                {/* ✅ Copy icon with click handler */}
                {!playerLoading && challengedPlayer?.phone && (
                  <Copy
                    className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(challengedPlayer.phone)
                        .then(() => toast.success("Phone number copied!"))
                        .catch(() => toast.error("Failed to copy!"));
                    }}
                  />
                )}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-4">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyClick(num)}
                className="py-2 rounded-md border text-lg font-medium hover:bg-gray-500 dark:hover:bg-gray-800"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="col-span-5 py-2 rounded-md border text-lg font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
            >
              X backspace
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default Challenge;
