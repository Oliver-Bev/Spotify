"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation"; 
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error) return setError(error.message);
   
      await supabase.from("users").insert({ id: data.user.id, username });
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) return setError(error.message);
    }
  };

  return (
    <div className="min-h-screen -mt-10 flex items-center justify-center bg-black text-white text-center">

<Link href="/" passHref>
            <div className="flex flex-col w-10 left-2 top-10 h-10 items-center cursor-pointer hover:text-indigo-400 transition absolute">
                
                <div className="text-xs"><ArrowLeft size={32}/></div>
            </div>
        </Link>

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg w-80 space-y-4"
      >
        <h2 className="text-3xl font-semibold">
          {isRegister ? "Rejestracja" : "Logowanie"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-black/70 border border-white/20"
          required
        />
        {isRegister && (
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-black/70 border border-white/20"
            required
          />
        )}
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-black/70 border border-white/20"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 rounded"
        >
          {isRegister ? "Zarejestruj" : "Zaloguj"}
        </button>

        <p
          className="text-sm underline cursor-pointer text-center"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Masz już konto? Zaloguj" : "Nie masz konta? Zarejestruj"}
        </p>
      </form>
    </div>
  );
}
