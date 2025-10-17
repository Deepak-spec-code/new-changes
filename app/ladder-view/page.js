"use client";

import { useState } from "react";
import DummyPlayerList from "@/components/shared/DummyPlayerList";
import DummyActivity from "@/components/shared/DummyActivity";
import DummyUserRules from "@/components/shared/DummyUserRules";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import LocalDiscount from "@/components/shared/LocalDiscount";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function LadderView() {
  const router = useRouter();

  const [showLadder, setShowLadder] = useState(true); // toggle ladder on/off
  const searchParams = useSearchParams();
  const ladderId = searchParams.get("ladderId");

  return (
    <div className="flex flex-col w-full min-h-screen py-4 bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200">
      {/* Back Button */}
      <div className="sm:px-12 md:px-12 lg:px-12 w-full mb-2"></div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-8 lg:px-12 max-w-8xl mx-auto">
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto cursor-pointer px-6 sm:px-8 py-2 text-sm sm:text-md font-semibold"
          onClick={() => router.back()}
        >
          ← Back
        </Button>

        <Button
          onClick={() => setShowLadder(!showLadder)}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto cursor-pointer px-6 sm:px-8 py-2 text-sm sm:text-md font-semibold bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          {showLadder ? "Ladder ON" : "Ladder OFF"}
        </Button>
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row w-full px-4 sm:px-0 md:px-0 lg:px-0 mx-auto  ">
        {/* Mobile/desktop Ladder */}
        <AnimatePresence>
          {/* Mobile: show ladder only when toggle is ON */}

          {showLadder && (
            <motion.div
              key="ladder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 md:flex-2"
            >
              <DummyPlayerList ladderId={ladderId} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Other Components */}
        <AnimatePresence>
          {/* Mobile: show rules + activity only when toggle is OFF */}
          {(!showLadder || window.innerWidth >= 768) && (
            <motion.div
              key="others"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col gap-4 sm:mt-16"
            >
              <div className="flex items-center justify-center w-full">
                <DummyUserRules ladderId={ladderId} />
              </div>

              <div className="flex items-center justify-center w-full">
                <DummyActivity ladderId={ladderId} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
