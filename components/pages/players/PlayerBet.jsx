// playerBet.jsx


"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Sparkle } from "lucide-react";

const PlayerBet = ({ ladderId, selectedPlayer }) => {
  const [challenger, setChallenger] = useState("");
  const [betDescription, setBetDescription] = useState("");

  const players =
    useSelector((state) => state.player?.players?.[ladderId]?.data) || [];

  const handleSubmit = () => {
    if (!challenger || !betDescription) {
      toast.error("Please select opponent and enter bet description");
      return;
    }

    // 👉 Backend API call placeholder
    console.log({
      player1_id: selectedPlayer?.id,
      player2_id: challenger,
      description: betDescription,
    });

    toast.success("Bet placed successfully! 🥤");
    setChallenger("");
    setBetDescription("");
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Select Opponent */}
      <div>
        <label className="font-semibold mb-2 block">Select Opponent</label>
        <Select onValueChange={(val) => setChallenger(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a player to bet with" />
          </SelectTrigger>
          <SelectContent>
            {players
              .filter((p) => p.id !== selectedPlayer?.id)
              .map((player) => (
                <SelectItem key={player.id} value={String(player.id)}>
                  {player.name} (Rank {player.rank})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bet Description */}
      <div>
        <label className="font-semibold mb-2 block">Bet Description</label>
        <Input
          placeholder="e.g. Loser buys winner a Pint 🍹"
          value={betDescription}
          onChange={(e) => setBetDescription(e.target.value)}
        />
      </div>

      {/* Place Bet Button with sparkle + hover effect */}
      {/* <button
        onClick={handleSubmit}
        className="
          relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
          text-gray-900
          bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500
          hover:scale-105 hover:from-yellow-500 hover:to-yellow-400
          transition-transform duration-200 shadow-md
        "
      >
        <Sparkle className="w-5 h-5 text-white animate-pulse" />
        Place Bet
        <span className="absolute inset-0 bg-white opacity-10 rounded-lg pointer-events-none transform rotate-12 scale-150 transition-opacity duration-500 hover:opacity-20"></span>
      </button> */}



      <button
  onClick={handleSubmit}
  className="
    relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
    text-gray-900 text-xl font-weight-700
    bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500
    hover:scale-105 hover:from-yellow-500 hover:to-yellow-400
    transition-transform duration-200 shadow-md overflow-hidden
  "
>
  Place Bet

  {/* Falling sparkles */}
  {[...Array(18)].map((_, i) => {
    const left = Math.random() * 100; // percent
    const duration = 1 + Math.random(); // 1-2s
    const delay = Math.random(); // 0-1s
    return (
      <span
        key={i}
        style={{
          position: "absolute",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          backgroundColor: "white",
          opacity: 0.8,
          left: `${left}%`,
          top: "-5px",
          animation: `fall ${duration}s linear ${delay}s infinite`,
        }}
      />
    );
  })}

  <style>
    {`
      @keyframes fall {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(30px) rotate(360deg); opacity: 0; }
      }
    `}
  </style>
</button>

    </div>
  );
};

export default PlayerBet;



// EditPlayer.jsx
 
 
 

