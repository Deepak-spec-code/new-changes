import React from "react";
import Image from "next/image";

export default function PlayerCardMobileExact({ rank, name, phone, avatar, scores = [], total }) {
  return (
    <div className="w-90 bg-[#0b5f6f] border border-[#1ba3b5] rounded-lg overflow-hidden shadow-md">
      <div className="w-full h-[6px] bg-[#1aa0b3]"></div>

      <div className="flex items-center p-2 pr-3">
        <div className="w-10 flex justify-center -ml-1">
          <div className="w-8 h-8 rounded-full bg-[#e5e5e5] border-2 border-black flex items-center justify-center text-black font-bold text-sm">
            {rank}
          </div>
        </div>

        <div className="w-10 h-10 rounded-full overflow-hidden ml-1 border border-black shadow">
          <Image
            src={avatar }
            width={40}
            height={40}
            alt="avatar"
            className="object-cover"
          />
        </div>

        <div className="flex-1 ml-2 text-white">
          <div className="leading-4 font-semibold text-sm">{name}</div>
          <div className="text-[11px] opacity-80">{phone}</div>

          <div className="mt-1">
            <div className="flex gap-[4px] mb-[2px] text-[10px] opacity-70">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-6 text-center">{i + 1}</div>
              ))}
            </div>

            <div className="flex gap-[4px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 text-[11px] flex items-center justify-center border border-white rounded-sm ${
                    scores[i] ? "bg-white text-black font-bold" : "bg-transparent"
                  }`}
                >
                  {scores[i] || ""}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-12 flex justify-end">
          <div className="w-10 h-10 rounded-full bg-[#00323d] border-2 border-black flex items-center justify-center text-lg font-bold text-white">
            {total}
          </div>
        </div>
      </div>
    </div>
  );
}