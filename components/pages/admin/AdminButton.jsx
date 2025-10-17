
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UploadPlayerLists from "../uploadCsv/UploadPlayerLists";
import { paymentPage } from "@/helper/RouteName";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AddRemoveBox from "./AddRemoveBox";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import { fetchGradebars } from "@/redux/slices/gradebarSlice";
import EditGradebarDialog from "./EditGradebarDialog";


const AdminButton = () => {
  const APPKEY =
    "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openAddPlayerDialog, setOpenAddPlayerDialog] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const ladderId = searchParams.get("ladder_id"); // ✅ Only use URL param

  const { gradebarDetails } = useSelector((state) => state.gradebar);

  // Fetch gradebars on ladderId change
  useEffect(() => {
    if (ladderId) {
      dispatch(fetchGradebars(ladderId));
    }
  }, [ladderId, dispatch]);

  // 🔹 RESET LADDER
  const handleReset = async () => {
    if (!ladderId) return toast.error("Ladder ID not found.");
    setLocalLoading(true);

    try {
      await axios.get(
        `https://ne-games.com/leaderBoard/api/user/Resetleaderboard?ladder_id=${ladderId}`,
        { headers: { APPKEY } }
      );
      toast.success("Leaderboard has been reset!");
      setOpenConfirmDialog(false);

      // Open upload dialog automatically
      setOpenUploadDialog(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset leaderboard.");
    } finally {
      setLocalLoading(false);
    }
  };

  // Upgrade
  const handleUpgrade = () => router.push(paymentPage);

  // Open Edit Sections
  const handleEditSection = () => setOpenEditDialog(true);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 px-4 md:px-8 mt-4 md:mt-0">
      {/* RESET LADDER */}
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogTrigger asChild>
          <Button
            className=" border border-gray-400 hover:text-white transition-all ease-in-out duration-700 font-semibold text-sm sm:px-4 sm:py-4 md:py-6 sm:rounded-sm shadow-lg bg-blue-900 text-white hover:bg-blue-950 rounded-lg w-full py-6 cursor-pointer"
            disabled={localLoading}
            onClick={() => setOpenConfirmDialog(true)}
          >
            RESET <br /> LADDER
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Reset</DialogTitle>
          </DialogHeader>
          {localLoading ? (
            <div className="text-center py-4">Please wait...</div>
          ) : (
            <>
              <p className="text-sm mb-4">
                THIS WILL DELETE THE PRESENT LADDER – ARE YOU SURE?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpenConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleReset}
                  disabled={localLoading}
                >
                  Yes, Reset
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* UPLOAD PLAYER LIST */}
      <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload CSV</DialogTitle>
          </DialogHeader>
          <UploadPlayerLists
            ladderId={ladderId}
            onSuccessClose={() => {
              setOpenUploadDialog(false);
              dispatch(fetchLeaderboard({ ladder_id: ladderId }));
              dispatch(fetchGradebars(ladderId));
              toast.success("Players uploaded successfully!");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ADD/REMOVE PLAYER */}
      <Dialog open={openAddPlayerDialog} onOpenChange={setOpenAddPlayerDialog}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpenAddPlayerDialog(true)}
            className=" border border-gray-400  hover:text-white ease-in-out duration-700 font-semibold text-sm sm:px-4 sm:py-4 md:py-6 sm:rounded-sm rounded-lg w-full py-6 cursor-pointer bg-blue-900 text-white hover:bg-blue-950 transition-all shadow-lg  "
          >
            ADD/REMOVE <br /> MOVE PLAYER
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <AddRemoveBox />
        </DialogContent>
      </Dialog>

      {/* Gradebar Editing Dialog */}
      <EditGradebarDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        ladderId={ladderId}
        gradebarDetails={gradebarDetails}
      />

      {/* PURCHASE LADDER */}
     <Button
  onClick={handleUpgrade}
  onMouseDown={(e) => {
    e.target.classList.add('slow-flash-animation');
  }}
  onMouseUp={(e) => {
    e.target.classList.remove('slow-flash-animation');
  }}
  className=" transition-all duration-700 ease-in-out text-sm sm:px-4 sm:py-4 md:py-6 sm:rounded-md shadow-md cursor-pointer rounded-2xl w-full py-6 text-white bg-gradient-to-r from-red-800 to-blue-700 font-semibold "
>
  PURCHASE <br /> LADDER
</Button>

    </div>
  );
};

export default AdminButton;
