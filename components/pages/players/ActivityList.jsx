

"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import digitalTwin from "@/public/digital-twin.gif";
import { fetchUserActivity } from "@/redux/slices/activitySlice";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const ActivityLog = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const ladder_id = searchParams.get("ladder_id");
  const { loading, data, error } = useSelector((state) => state.activity);

  useEffect(() => {
    if (ladder_id) {
      dispatch(fetchUserActivity({ ladder_id: Number(ladder_id) }));
    }
  }, [ladder_id, dispatch]);

  const activities = data?.data || [];

  const renderActivities = () => {
    return activities.map((activity, index) => {
      const progress = activity.progress?.toLowerCase();
      let icon = null;

      if (progress === "up") {
        icon = <FaLongArrowAltUp className="text-green-500" size={18} />;
      } else if (progress === "down") {
        icon = <FaLongArrowAltDown className="text-red-500" size={18} />;
      }

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="mb-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200"
        >
          <p className="text-base md:text-lg font-medium flex items-center gap-2 text-gray-800">
            {icon}
            {activity.message}
          </p>
        </motion.div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="flex items-center justify-center mx-6 text-white bg-gradient-to-r from-[#141C2B] to-gray-900 rounded-lg font-semibold text-xl  hover cursor-pointer  shadow-xl ">
        <CardContent className="w-full max-w-2xl p-6">
          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-extrabold mb-6 text-center flex items-center justify-center gap-3"
          >
            <Image
              src={digitalTwin}
              width={50}
              height={50}
              alt="activity"
              className="rounded-full"
            />
            <span className="text-zinc-300 bg-clip-text ">
              ACTIVITY
            </span>
          </motion.h2>

          {/* Scrollable Body */}
          <div
            className="w-full max-h-[400px] overflow-y-auto px-2 pr-3 space-y-3 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent hover:scrollbar-thumb-purple-500"
          >
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 flex items-center gap-3 animate-pulse"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : error ? (
              <p className="text-center text-red-600 font-semibold">
                {error}
              </p>
            ) : activities.length === 0 ? (
              <p className="text-center text-zinc-300">
                No activity available.
              </p>
            ) : (
              renderActivities()
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scrollbar styles */}
      <style jsx global>{`
        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #a78bfa; /* purple-400 */
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #8b5cf6; /* purple-500 */
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </motion.div>
  );
};

export default ActivityLog;
