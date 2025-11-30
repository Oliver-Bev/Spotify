import React from "react";
import type { Metadata } from "next";
import Controls from "@/components/Controls";
import Header from "@/components/Header";
import { Search } from 'lucide-react';

export default function SearchInput() {
  return (
   
<div className="min-h-screen bg-black text-white pt-16">
    <Header />
    
    <div className="relative mx-auto max-w-lg px-5 "> 

        <input
            type="text"
            placeholder="Czego dziś słuchasz?"
            className="w-full p-3 pl-10 text-white bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-indigo-400 placeholder-white/50"
        />

        <Search 
            className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white/70"
            size={20} 
        />
    </div>


    <Controls />
</div>


  );
}












   