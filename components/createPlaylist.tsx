"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

export default function CreatePlaylist({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    console.log("Dodano playlistę:", name);

    

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      {/* TŁO kliknięcie zamyka */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* OKNO */}
      <div
        className="relative bg-transparent text-white rounded-lg p-6 w-11/12 max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Nowa playlista</h2>

        <form onSubmit={handleAdd} className="space-y-4">
          <input
            type="text"
            placeholder="Nazwa playlisty"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-black/70 border border-white/20 focus:outline-none"
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded"
            >
              Anuluj
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded flex items-center gap-2"
            >
              <Plus size={16} />
              Dodaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
