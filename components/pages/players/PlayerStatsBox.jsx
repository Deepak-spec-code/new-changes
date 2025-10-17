

// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPlayerResult } from "@/redux/slices/PlayerResultSlice";
// import { motion } from "framer-motion";
// import { LiaHandPointRight } from "react-icons/lia";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogHeader,
//   DialogDescription,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// export default function PlayerStatsUser({ userId, ladderId }) {
//   const dispatch = useDispatch();
//   const { data, loading, error } = useSelector((state) => state.playerResult);

//   useEffect(() => {
//     if (userId && ladderId) {
//       dispatch(fetchPlayerResult({ user_id: userId, ladder_id: ladderId }));
//     }
//   }, [userId, ladderId, dispatch]);

//   if (loading) {
//     return (
//       <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md">
//         <CardHeader>
//           <CardTitle>Player Statistics</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <Skeleton className="h-8 w-full" />
//           <Skeleton className="h-8 w-full" />
//           <Skeleton className="h-8 w-full" />
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md">
//         <CardHeader>
//           <CardTitle className="text-red-600">Error</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-red-500">{error}</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className=" flex justify-center"
//     >
//       <div className="w-full sm:w-full lg:max-w-md sm:max-w-md md:max-w-md overflow-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 py-3">
//           <h1 className="text-base sm:text-lg font-semibold">Stats Player</h1>

//           {/* Stats Explanation Dialog */}
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
//                 Stats Explained
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-xl ">
//               <DialogHeader>
//                 <DialogDescription className="space-y-2 text-sm sm:text-base">
//                   <div className="text-black ">
//                     {/* <LiaHandPointRight /> */}
//                     <DialogTitle className="text-lg sm:text-2xl font-semibold py-2 mb-4 text-blue-950 text-center border-b ">
                          
//                        Your score points on this basis
                    
//                     </DialogTitle>
               
//                     <span>(i) WIN v Higher-section: +8</span> <br />
//                     <span>(ii) WIN v Same section: +4</span> <br />
//                     <span>(iii) WIN v Lower section: +2</span> <br />
//                     <span>(iv) LOSS v Higher section: -4</span> <br />
//                     <span>(-2 if 2-1)</span><br />
//                     <span>(v) LOSS v Same section: -6</span> <br />
//                     <span>(-4 if 2-1)</span> <br />
//                     <span className="font-semibold text-black">
//                       (vi) LOSS v Lower section: -10
//                     </span> <br />
//                     <span>(-8 if 2-1)</span>
//                     <br />
//                     <br />
//                     <p className="sm:text-start text-center font-semibold text-sm  ">
//                       Your points are totalled and divided by the total number
//                       of games you played to give you your “average points per
//                       game”
//                       <br />
//                       <span className="text-sm">
//                         This helps to balance out points from players who play a
//                         lot and those who don’t
//                       </span>
//                     </p>
//                     <br />
//                     <p className="text-red-600 italic flex gap-2 items-center">
//                       Your “average points per match” is
//                       your Playing Performance
//                     </p>
//                     <br />
//                     <p className="underline text-center">
//                       Your “Playing Performance” is then ranked
//                     </p>
//                   </div>
//                 </DialogDescription>
//               </DialogHeader>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div>
//           {data ? (
//             <div className="w-full overflow-x-auto">
//               <Table className="w-full text-xs sm:text-sm md:text-base ">
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Games</TableHead>
//                     <TableHead className="text-green-600">Wins</TableHead>
//                     <TableHead className="text-red-600">Losses</TableHead>
//                     <TableHead>Points</TableHead>
//                     <TableHead>Avg.Points</TableHead>
//                     <TableHead>Rank</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <motion.tr
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className="border-b"
//                   >
//                     <TableCell>{data.result?.total_game}</TableCell>
//                     <TableCell className="font-semibold text-green-600">
//                       {data.result?.total_win}
//                     </TableCell>
//                     <TableCell className="font-semibold text-red-600">
//                       {data.result?.total_lost}
//                     </TableCell>
//                     <TableCell className="font-semibold">
//                       {data.result?.total_point}
//                     </TableCell>
//                     <TableCell className="font-semibold">
//                       {data.result?.total_game > 0
//                         ? (
//                             data.result.total_point / data.result.total_game
//                           ).toFixed(2)
//                         : 0}
//                     </TableCell>
//                     <TableCell className="font-semibold">
//                       {data.win_rank}
//                     </TableCell>
//                   </motion.tr>
//                 </TableBody>
//               </Table>
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center">
//               No stats found for this player.
//             </p>
//           )}
//         </div>


//       </div>
//     </motion.div>
//   );
// }
















// ===============================

// "use client";

// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPlayerResult } from "@/redux/slices/PlayerResultSlice";
// import { motion } from "framer-motion";
// import gsap from "gsap";
// import { Button } from "@/components/ui/button";
// import { Info } from "lucide-react"
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogHeader,
//   DialogDescription,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function PlayerStatsUser({ userId, ladderId }) {
//   const dispatch = useDispatch();
//   const { data, loading, error } = useSelector((state) => state.playerResult);
//   const cardRef = useRef(null);

//   useEffect(() => {
//     if (userId && ladderId) {
//       dispatch(fetchPlayerResult({ user_id: userId, ladder_id: ladderId }));
//     }
//   }, [userId, ladderId, dispatch]);

//   // ✨ GSAP entry animation
//   useEffect(() => {
//     if (!loading && cardRef.current) {
//       gsap.fromTo(
//         cardRef.current,
//         { opacity: 0, y: 60 },
//         { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
//       );
//     }
//   }, [loading]);

//   if (loading) {
//     return (
//       <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-lg bg-gray-900 border border-gray-700">
//         <CardHeader>
//           <CardTitle className="text-white text-lg">Loading Stats...</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <Skeleton className="h-8 w-full bg-gray-700" />
//           <Skeleton className="h-8 w-full bg-gray-700" />
//           <Skeleton className="h-8 w-full bg-gray-700" />
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md bg-red-900 border border-red-700">
//         <CardHeader>
//           <CardTitle className="text-red-200">Error</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-red-100">{error}</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <motion.div
//       ref={cardRef}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="flex justify-center w-full"
//     >
//       <div className="w-full sm:max-w-full bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 text-white rounded-2xl shadow-2xl p-5 overflow-hidden border border-gray-700 backdrop-blur-md">
        
//         {/* 🌟 Header with Dialog */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
//           <motion.h1
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.6 }}
//             className="text-lg sm:text-xl font-bold tracking-wide text-white"
//           >
//             🏆 Player Statistics
//           </motion.h1>

//             <Dialog>
//       <DialogTrigger asChild>
//         <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 text-xs sm:text-sm px-4 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2">
//           <Info className="w-4 h-4" />
//           Stats Explained
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-2xl backdrop-blur-md bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 text-white border border-blue-100 shadow-2xl rounded-2xl p-6 sm:p-8 overflow-hidden">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           transition={{ duration: 0.3, ease: "easeOut" }}
//         >
//           <DialogHeader>
//             <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-blue-200 border-b pb-3">
//               🎯 Your Score Points Are Calculated Like This
//             </DialogTitle>

//             <DialogDescription className="text-gray-100 text-sm sm:text-base leading-relaxed space-y-2 mt-4">
//               <div className="space-y-1">
//                 <p>🏆 <b>WIN vs Higher Section:</b> +8</p>
//                 <p>🏆 <b>WIN vs Same Section:</b> +4</p>
//                 <p>🏆 <b>WIN vs Lower Section:</b> +2</p>
//                 <p>❌ <b>LOSS vs Higher Section:</b> -4 <span className="text-gray-200">(−2 if 2-1)</span></p>
//                 <p>❌ <b>LOSS vs Same Section:</b> -6 <span className="text-gray-200">(−4 if 2-1)</span></p>
//                 <p>❌ <b>LOSS vs Lower Section:</b> <span className="text-red-600 font-semibold">-10</span> <span className="text-gray-200">(−8 if 2-1)</span></p>
//               </div>

//               <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-3 rounded-md mt-4">
//                 <p className="font-semibold text-blue-900">
//                   Total points are divided by the total number of games played.
//                 </p>
//                 <p className="text-sm text-gray-700">
//                   This keeps fairness between frequent and occasional players.
//                 </p>
//               </div>

//               <p className="text-red-200 italic text-center mt-3 font-medium text-md">
//                 “Average points per match” = Playing Performance
//               </p>

//               <div className="text-center mt-4">
//                 <p className="underline font-semibold text-blue-50">
//                   Playing Performance determines your Rank 🥇
//                 </p>
//               </div>
//             </DialogDescription>
//           </DialogHeader>
//         </motion.div>
//       </DialogContent>
//     </Dialog>
//         </div>

//         {/* ⚡ Stats Table */}
//         {data ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="rounded-xl overflow-hidden border border-gray-700 shadow-inner bg-black/30"
//           >
//             <Table className="w-full text-xs sm:text-sm md:text-base">
//               <TableHeader className="bg-gradient-to-r from-gray-800 to-gray-900">
//                 <TableRow>
//                   <TableHead className="text-blue-400">Games</TableHead>
//                   <TableHead className="text-green-400">Wins</TableHead>
//                   <TableHead className="text-red-400">Losses</TableHead>
//                   <TableHead className="text-sky-300">Points</TableHead>
//                   <TableHead className="text-violet-300">Avg</TableHead>
//                   <TableHead className="text-yellow-300">Rank</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <motion.tr
//                   initial={{ opacity: 0, x: -30 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
//                   className="border-b border-gray-700 hover:bg-gray-800/70 transition-all duration-200"
//                 >
//                   <TableCell>{data.result?.total_game}</TableCell>
//                   <TableCell className="font-semibold text-green-400">
//                     {data.result?.total_win}
//                   </TableCell>
//                   <TableCell className="font-semibold text-red-400">
//                     {data.result?.total_lost}
//                   </TableCell>
//                   <TableCell className="font-semibold text-sky-300">
//                     {data.result?.total_point}
//                   </TableCell>
//                   <TableCell className="font-semibold text-violet-300">
//                     {data.result?.total_game > 0
//                       ? (data.result.total_point / data.result.total_game).toFixed(2)
//                       : 0}
//                   </TableCell>
//                   <TableCell className="font-semibold text-yellow-300">
//                     {data.win_rank}
//                   </TableCell>
//                 </motion.tr>
//               </TableBody>
//             </Table>
//           </motion.div>
//         ) : (
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-gray-400 text-center py-4"
//           >
//             No stats found for this player.
//           </motion.p>
//         )}
//       </div>
//     </motion.div>
//   );
// }















// ==============================================

// "use client";

// import { useEffect, useRef, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPlayerResult } from "@/redux/slices/PlayerResultSlice";
// import { motion } from "framer-motion";
// import gsap from "gsap";
// import { Button } from "@/components/ui/button";
// import { Info } from "lucide-react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogHeader,
//   DialogDescription,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";


// export default function PlayerStatsUser({ userId, ladderId }) {
//   const dispatch = useDispatch();
//   const { data, loading, error } = useSelector((state) => state.playerResult);
//   const cardRef = useRef<HTMLDivElement | null>(null);

//   // Read ladder details to decide label
//   const ladderDetails =
//     useSelector((state) => state.player?.players?.[ladderId]?.ladderDetails) || {};
//   const ladderType = ladderDetails?.type || "winlose";

//   const ladderTypeLabel =
//     ladderType === "best3" ? "Best of 3" : ladderType === "best5" ? "Best of 5" : "Win/Lose";

//   useEffect(() => {
//     if (userId && ladderId) {
//       dispatch(fetchPlayerResult({ user_id: userId, ladder_id: ladderId }));
//     }
//   }, [userId, ladderId, dispatch]);

//   // GSAP entry animation
//   useEffect(() => {
//     if (!loading && cardRef.current) {
//       gsap.fromTo(
//         cardRef.current,
//         { opacity: 0, y: 60 },
//         { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
//       );
//     }
//   }, [loading]);

//   if (loading) {
//     return (
//       <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-lg bg-gray-900 border border-gray-700">
//         <CardHeader>
//           <CardTitle className="text-white text-lg">Loading Stats...</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <Skeleton className="h-8 w-full bg-gray-700" />
//           <Skeleton className="h-8 w-full bg-gray-700" />
//           <Skeleton className="h-8 w-full bg-gray-700" />
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md bg-red-900 border border-red-700">
//         <CardHeader>
//           <CardTitle className="text-red-200">Error</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-red-100">{error}</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <motion.div
//       ref={cardRef}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="flex justify-center w-full"
//     >
//       <div className="w-full sm:max-w-full bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 text-white rounded-2xl shadow-2xl p-5 overflow-hidden border border-gray-700 backdrop-blur-md">
//         {/* Header with ladder type badge and Dialog */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.6 }}
//             className="flex items-center gap-3"
//           >
//             <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white">
//               🏆 Player Statistics
//             </h1>
//             <span className="inline-flex items-center rounded-md bg-white/10 border border-white/15 px-2.5 py-1 text-xs font-medium text-white/90">
//               {ladderTypeLabel}
//             </span>
//           </motion.div>

//           <Dialog>
//             <DialogTrigger asChild>
//               <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 text-xs sm:text-sm px-4 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2">
//                 <Info className="w-4 h-4" />
//                 Stats Explained
//               </Button>
//             </DialogTrigger>

//             <DialogContent className="sm:max-w-2xl backdrop-blur-md bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 text-white border border-blue-100 shadow-2xl rounded-2xl p-6 sm:p-8 overflow-hidden">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 transition={{ duration: 0.3, ease: "easeOut" }}
//               >
//                 <DialogHeader>
//                   <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-blue-200 border-b pb-3">
//                     🎯 Scoring & Format ({ladderTypeLabel})
//                   </DialogTitle>

//                   <DialogDescription className="text-gray-100 text-sm sm:text-base leading-relaxed space-y-2 mt-4">
//                     <div className="space-y-1">
//                       <p>🏆 <b>WIN vs Higher Section:</b> +8</p>
//                       <p>🏆 <b>WIN vs Same Section:</b> +4</p>
//                       <p>🏆 <b>WIN vs Lower Section:</b> +2</p>
//                       <p>❌ <b>LOSS vs Higher Section:</b> -4 <span className="text-gray-200">(−2 if 2-1)</span></p>
//                       <p>❌ <b>LOSS vs Same Section:</b> -6 <span className="text-gray-200">(−4 if 2-1)</span></p>
//                       <p>❌ <b>LOSS vs Lower Section:</b> <span className="text-red-600 font-semibold">-10</span> <span className="text-gray-200">(−8 if 2-1)</span></p>
//                     </div>

//                     <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-3 rounded-md mt-4 text-blue-900">
//                       <p className="font-semibold">
//                         Total points are divided by the total number of games played.
//                       </p>
//                       <p className="text-sm">
//                         This keeps fairness between frequent and occasional players.
//                       </p>
//                     </div>

//                     <p className="text-red-200 italic text-center mt-3 font-medium text-md">
//                       “Average points per match” = Playing Performance
//                     </p>

//                     <div className="text-center mt-4">
//                       <p className="underline font-semibold text-blue-50">
//                         Playing Performance determines your Rank 🥇
//                       </p>
//                     </div>
//                   </DialogDescription>
//                 </DialogHeader>
//               </motion.div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Stats Table */}
//         {data ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="rounded-xl overflow-hidden border border-gray-700 shadow-inner bg-black/30"
//           >
//             <Table className="w-full text-xs sm:text-sm md:text-base">
//               <TableHeader className="bg-gradient-to-r from-gray-800 to-gray-900">
//                 <TableRow>
//                   <TableHead className="text-blue-400">Games</TableHead>
//                   <TableHead className="text-green-400">Wins</TableHead>
//                   <TableHead className="text-red-400">Losses</TableHead>
//                   <TableHead className="text-sky-300">Points</TableHead>
//                   <TableHead className="text-violet-300">Avg</TableHead>
//                   <TableHead className="text-yellow-300">Rank</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <motion.tr
//                   initial={{ opacity: 0, x: -30 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
//                   className="border-b border-gray-700 hover:bg-gray-800/70 transition-all duration-200"
//                 >
//                   <TableCell>{data.result?.total_game}</TableCell>
//                   <TableCell className="font-semibold text-green-400">
//                     {data.result?.total_win}
//                   </TableCell>
//                   <TableCell className="font-semibold text-red-400">
//                     {data.result?.total_lost}
//                   </TableCell>
//                   <TableCell className="font-semibold text-sky-300">
//                     {data.result?.total_point}
//                   </TableCell>
//                   <TableCell className="font-semibold text-violet-300">
//                     {data.result?.total_game > 0
//                       ? (data.result.total_point / data.result.total_game).toFixed(2)
//                       : 0}
//                   </TableCell>
//                   <TableCell className="font-semibold text-yellow-300">
//                     {data.win_rank}
//                   </TableCell>
//                 </motion.tr>
//               </TableBody>
//             </Table>
//           </motion.div>
//         ) : (
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-gray-400 text-center py-4"
//           >
//             No stats found for this player.
//           </motion.p>
//         )}
//       </div>
//     </motion.div>
//   );
// }































"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayerResult } from "@/redux/slices/PlayerResultSlice";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// ✅ Normalize match type
function normalizeMatchType(raw) {
  if (!raw) return "best of 3";
  const str = String(raw).toLowerCase().trim();
  const compact = str.replace(/[\s_-]/g, "");
  if (
    str.includes("5") ||
    compact.includes("bo5") ||
    compact.includes("bestof5") ||
    compact.includes("bestoffive")
  ) {
    return "best of 5";
  }
  return "best of 3";
}

export default function PlayerStatsBox() {
  const searchParams = useSearchParams();
  const ladderId = searchParams.get("ladder_id");

  // ✅ Ladder selection
  const ladders = useSelector((state) => state.fetchLadder?.allLadders || []);
  const currentLadder = ladders.find(
    (ladder) => String(ladder.id) === String(ladderId)
  );
  const type = currentLadder?.type || "";

  const userId = useSelector((state) => state.player.selectedPlayer?.id);
  const matchType = useMemo(() => normalizeMatchType(type), [type]);

  if (!currentLadder) {
    return (
      <div className="text-center text-gray-500 mt-6">
        Loading ladder details...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-lg mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-semibold">
          Match Type:{" "}
          <span className="text-blue-600 capitalize">{matchType}</span>
        </h2>
      </div>

      <PlayerStatsUser
        userId={userId}
        ladderId={ladderId}
        matchType={matchType}
      />
    </div>
  );
}

function PlayerStatsUser({ userId, ladderId, matchType }) {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.playerResult);

  useEffect(() => {
    if (userId && ladderId) {
      dispatch(fetchPlayerResult({ user_id: userId, ladder_id: ladderId }));
    }
  }, [userId, ladderId, dispatch]);

  const playerData = data?.result;
  const winRank = data?.win_rank;

  if (loading)
    return (
      <Card className="w-full mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Loading Player Stats...</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-full bg-gray-200 animate-pulse rounded mb-2"
            />
          ))}
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card className="w-full mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center"
    >
      <div className="w-full sm:w-full lg:max-w-md overflow-x-auto">
        {/* Header + Dialog */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-2 py-3 gap-3">
          <h1 className="text-base sm:text-lg font-semibold text-center sm:text-left">
            Player Stats • {matchType}
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                Stats Explained
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-w-[90vw] p-4">
              <DialogHeader>
                <DialogTitle className="text-center text-base sm:text-lg font-bold text-blue-900">
                  Your score points on this basis
                </DialogTitle>
                <DialogDescription className="mt-3 text-sm sm:text-base text-black space-y-1">
                  {matchType === "best of 5" ? (
                    <>
                      <p>(i) WIN v Higher-section: +8</p>
                      <p>(ii) WIN v Same section: +4</p>
                      <p>(iii) WIN v Lower section: +2</p>
                      <p>(iv) LOSS v Higher section: -4</p>
                      <p>(-2 if 3-1) (-0 if 3-2)</p>
                      <p>(v) LOSS v Same section: -6</p>
                      <p>(-4 if 3-1) (-2 if 3-2)</p>
                      <p className="font-semibold">
                        (vi) LOSS v Lower section: -10
                      </p>
                      <p>(-8 if 3-1) (-6 if 3-2)</p>
                    </>
                  ) : (
                    <>
                      <p>(i) WIN v Higher-section: +8</p>
                      <p>(ii) WIN v Same section: +4</p>
                      <p>(iii) WIN v Lower section: +2</p>
                      <p>(iv) LOSS v Higher section: -4</p>
                      <p>(-2 if 2-1)</p>
                      <p>(v) LOSS v Same section: -6</p>
                      <p>(-4 if 2-1)</p>
                      <p className="font-semibold">
                        (vi) LOSS v Lower section: -10
                      </p>
                      <p>(-8 if 2-1)</p>
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table Section */}
        {playerData ? (
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <Table className="w-full text-xs sm:text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Games</TableHead>
                  <TableHead className="text-green-600">Wins</TableHead>
                  <TableHead className="text-red-600">Win%</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Avg</TableHead>
                  <TableHead>Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border-b"
                >
                  <TableCell>{playerData?.total_game}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {playerData?.total_win}
                  </TableCell>
                  <TableCell className="font-semibold text-red-600">
                    {playerData?.win_percentage}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {playerData?.total_point}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {playerData?.total_game > 0
                      ? (
                          playerData?.total_point / playerData?.total_game
                        ).toFixed(2)
                      : 0}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {winRank ?? "-"}
                  </TableCell>
                </motion.tr>
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No stats found for this player.
          </p>
        )}

        {/* ✅ Footer Text */}
        <div className="text-center font-medium text-gray-600 text-sm mt-4">
          Need three results to get a ranking
        </div>
      </div>
    </motion.div>
  );
}
