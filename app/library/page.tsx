"use client";

import React, { useState } from "react";
import Controls from "@/components/Controls";
import Header from "@/components/Header";
import { Plus } from "lucide-react";
import CreatePlaylist from "@/components/createPlaylist"; // <-- IMPORT NOWEGO KOMPONENTU

export default function LibraryPage() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="min-h-screen w-full bg-black text-white pt-16">
      <Header />

      <div className="pt-5 pl-5 text-3xl">Twoje Playlisty:</div>

      <div className="flex flex-col justify-center items-center space-y-5 top-1/2 mt-20">
        <p>Aktualnie nie masz żadnych playlist</p>

        <div
          className="border-2 rounded-lg border-white/20 p-3 cursor-pointer flex items-center gap-2"
          onClick={openModal}
        >
          <Plus size={16} />
          <span>Stwórz nową</span>
        </div>
      </div>

      {/* KOMONENT MODALA */}
      {isOpen && <CreatePlaylist onClose={closeModal} />}

      <Controls />
    </div>
  );
}
