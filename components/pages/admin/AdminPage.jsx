

"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createLadder } from "@/redux/slices/ladderSlice";
import { uploadCSV } from "@/redux/slices/leaderboardSlice";
import { setLadderId } from "@/redux/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchLadders } from "@/redux/slices/fetchLadderSlice";
import { clearCreateLadderState } from "@/redux/slices/ladderSlice";
import Link from "next/link";
import { FileUp, ListChecks, Info, Users, Layers, Sparkles } from "lucide-react";

import UserDetails from "@/components/shared/UserDetails";
import LadderList from "./LadderList";
import LadderInfo from "./LadderInfo";

export default function AdminPage() {
  const [ladderName, setLadderName] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [ladderType, setLadderType] = useState("winlose"); // default ladder type

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user?.user);
  const loading = useSelector((state) => state.createLadder?.loading);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setCsvFile(e.target.files[0]);
  };

  const handleCreateLadder = async () => {
    if (!user?.id || !ladderName.trim() || !csvFile) {
      toast.warn("Please enter ladder name, upload CSV, and ensure user is logged in.");
      return;
    }

    try {
      const ladderResult = await dispatch(
        createLadder({
          user_id: user.id,
          name: ladderName.trim(),
          type: ladderType,
        })
      ).unwrap();

      dispatch(clearCreateLadderState());
      toast.success(ladderResult?.success_message || "Ladder created successfully.");

      const createdLadderId = ladderResult?.data?.ladder_id || ladderResult?.data?.id;
      if (createdLadderId) {
        dispatch(setLadderId(createdLadderId));

        // Update ladder in redux for type info
        dispatch(
          createLadder.fulfilled({
            data: { ladder_id: createdLadderId, name: ladderName, type: ladderType },
          } )
        );
      }

      // Upload CSV for created ladder
      await dispatch(uploadCSV({ file: csvFile, ladder_id: createdLadderId })).unwrap();
      toast.success("Users imported successfully!");

      // Refresh ladder list
      dispatch(fetchLadders(user.id));

      // Reset form
      setLadderName("");
      setCsvFile(null);
      setLadderType("winlose");

      // Redirect to player list
      setTimeout(() => {
        router.push(`/player-list?ladder_id=${createdLadderId}`);
      }, 900);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0f1430] to-[#0b1020]">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      <ToastContainer position="top-right" autoClose={2500} hideProgressBar theme="dark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Header strip */}
        <div className="mb-5 sm:mb-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/10">
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs text-white/70">Welcome to</p>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
                Your Admin Centre
              </h1>
            </div>
          </div>
          <div className="hidden sm:block">
            <UserDetails />
          </div>
        </div>

        {/* Glass hero */}
        <Card className="mb-6 border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white/90 flex items-center gap-2">
              <Info className="h-5 w-5 text-cyan-300" />
              Admin Tools
            </CardTitle>
            <CardDescription className="text-white/70">
              Here you can create new ladders and access current ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Left: Ladder types/info */}
              <div className="lg:col-span-3 space-y-5">
                <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white/90 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-fuchsia-300" />
                      Ladder Types
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Choose the format that matches your sport and scoring.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-white/80">
                    <LadderInfo />
                    <div className="space-y-2 text-sm">
                      <p>
                        Test a 'win/lose' demo Ladder (Login) -{" "}
                        <Link
                          href="/demo-login?autoLogin=true&demoType=winlose"
                          target="_blank"
                          className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
                        >
                          Click here
                        </Link>{" "}
                        - You will be logged in as the player ‘Joe Bloggs’
                      </p>
                      <p>
                        Test a 'Best of 3' demo Ladder (Login) -{" "}
                        <Link
                          href="/demo-login?autoLogin=true&demoType=best3"
                          target="_blank"
                          className="text-cyan-300 underline underline-offset-4 hover:text-cyan-2 00"
                        >
                          Click here
                        </Link>{" "}
                        - You will be logged in as the player ‘Joe Bloggs’
                      </p>
                      <p>
                        Test a 'Best of 5' demo Ladder (Login) -{" "}
                        <Link
                          href="/demo-login?autoLogin=true&demoType=best5"
                          target="_blank"
                          className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
                        >
                          Click here
                        </Link>{" "}
                        - You will be logged in as the player ‘Joe Bloggs’
                      </p>
                      <p className="text-white/80">
                        <span className="text-yellow-300">Note:</span> as in a live ladder, you will only
                        be able to work with Joe Bloggs’ icon
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Ladder list */}
                <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white/90 flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-cyan-300" />
                      Your Ladders
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Browse and manage ladders you created.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <LadderList userId={user?.id} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Create ladder form */}
              <div className="lg:col-span-2">
                <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white/90 flex items-center gap-2">
                      <Users className="h-5 w-5 text-fuchsia-300" />
                      Create a new ladder
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Add ladder name, type, and upload players CSV.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Ladder name</Label>
                      <Input
                        placeholder="e.g., Downtown Squash League"
                        value={ladderName}
                        onChange={(e) => setLadderName(e.target.value)}
                        className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">Type</Label>
                      <select
                        className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-white"
                        value={ladderType}
                        onChange={(e) => setLadderType(e.target.value)}
                      >
                        <option className="bg-[#0b1020]" value="winlose">Win/Lose</option>
                        <option className="bg-[#0b1020]" value="best3">Best of 3</option>
                        <option className="bg-[#0b1020]" value="best5">Best of 5</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">Players CSV</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          className="bg-white/10 border-white/10 text-white file:text-white file:bg-white/10 file:border-white/10"
                        />
                        {csvFile && (
                          <span className="text-xs text-white/70 truncate max-w-[160px]">
                            {csvFile.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateLadder}
                      disabled={!ladderName || !csvFile || loading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white font-semibold shadow-lg shadow-fuchsia-500/20"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <FileUp className="h-4 w-4 animate-bounce" />
                          Creating...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <FileUp className="h-4 w-4" />
                          Create Ladder
                        </span>
                      )}
                    </Button>

                    <p className="text-xs text-white/60">
                      CSV must include headers: name, email, phone (optional fields supported).
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
