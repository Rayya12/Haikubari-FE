"use client";

import Image from "next/image";
import Link from "next/link";;
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
        const response = await fetch("api/auth/forgot-password",{
            method : "POST",
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({email})
        })
    }catch (e:any) {
        setError(e?.message ?? "失敗しましたしばらくお待ちください。")
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center space-y-4"
      style={{ backgroundImage: "url(/loginBackground.png)" }}
    >
      <Image
        src="/blacklogo.png"
        alt="Haikubari Logo"
        width={500}
        height={500}
      />

      <div className="flex justify-center lg:w-1/3 sm:w-full space-x-4 p-4 border border-gray-300 rounded-lg shadow-lg">
      <div className="flex flex-col items-center w-full">
        <h1 className="flex mb-4 text-2xl font-bold">お持ちするメールアドレス入れて下さい</h1>

        <div className="flex text-black text-left font-bold w-3/4">
          <label htmlFor="email">メール</label>
        </div>

        <input
          type="email"
          name="email"
          id="email"
          className="w-3/4 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ateneo-blue text-black"
          value={email}
          onChange={handleEmail}
        />

        {error && (
          <div className="w-3/4 bg-red-300 p-2 rounded-md border border-red-700 text-red-950 mt-2">
            {error}
          </div>
        )}

        <button
          className="bg-lime-green text-white p-4 rounded-md shadow-md w-3/4 mt-4 mb-4 hover:ring-2 hover:ring-teal"
          onClick={handleForgotPassword}
        >
          確認
        </button>

        <Link
          className="text-ateneo-blue hover:font-bold"
          href={"/login"}
        >
            ログイン場面へ戻ります
        </Link>

        </div>

      </div>
    </div>
  );
}
