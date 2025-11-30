import React from "react";
import type { Metadata } from "next";
import Controls from "@/components/Controls";
import Header from "@/components/Header";
import { Frown, Plus } from 'lucide-react';

export default function LibraryPage() {
    return (

        <div className="min-h-screen w-full bg-black text-white pt-16 ">
            <Header />
            <div className="pt-5 pl-5 text-3xl">Twoje Playlisty:</div>

            <div className="flex flex-col justify-center items-center space-y-5 top-1/2 mt-20">
                <p>Aktualnie nie masz żadnych playlist</p>
                
                <div className="border-2 rounded-lg border border-white/20 h-auto w-auto p-3 cursor-pointer">Stwórz nową</div>
            </div>

            
             <Controls />
        </div>
    );}