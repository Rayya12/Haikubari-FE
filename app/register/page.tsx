'use client'

import { noto } from "@/app/ui/font"
import Form from 'next/form'
import Link from "next/link"
import {useActionState} from 'react'
import { handleRegister } from "../lib/action"
import { useState } from "react"


const initialState = { error: undefined as string | undefined }

export default function Register() {
  const [state, formAction] = useActionState<typeof initialState, FormData>(handleRegister as any, initialState)

  // 🔹 STATE PER INPUT (INI KUNCINYA)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const [role, setRole] = useState('')

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/loginBackground.png)' }}
    >
      <div className="flex flex-col w-full sm:w-3/4 lg:w-1/2 bg-white shadow-md rounded-md border border-gray-300 items-center justify-center px-4 py-8 space-y-4">
        <p className="text-black font-bold text-2xl">新しいアカウントを作る</p>

        <Form action={formAction} className="flex flex-col w-full justify-center items-center">

          {/* Username */}
          <div className="flex mb-1 text-left w-3/4 text-black font-bold">
            <label htmlFor="username">ユーザー</label>
          </div>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-black text-md border w-3/4 border-gray-300 p-2 rounded-md mb-2"
          />

          {/* Email */}
          <div className="flex mb-1 text-left w-3/4 text-black font-bold">
            <label htmlFor="email">メール</label>
          </div>
          <input
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black text-md border w-3/4 border-gray-300 p-2 rounded-md mb-2"
          />

          {/* Password */}
          <div className="flex mb-1 text-left w-3/4 text-black font-bold">
            <label htmlFor="password">パスワード</label>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black text-md border w-3/4 border-gray-300 p-2 rounded-md mb-2"
          />

          {/* Age */}
          <div className="flex mb-1 text-left w-3/4 text-black font-bold">
            <label htmlFor="age">年齢</label>
          </div>
          
          <input
            type="number"
            id="age"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="text-black text-md border w-3/4 border-gray-300 p-2 rounded-md mb-2"
          />

          {/* Role */}
          <div className="flex mb-1 text-left w-3/4 text-black font-bold">
            <p>役</p>
          </div>

          <div className="w-3/4 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="common"
                checked={role === 'common'}
                onChange={() => setRole('common')}
              />
              <span className="text-black">一般</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="watcher"
                checked={role === 'watcher'}
                onChange={() => setRole('watcher')}
              />
              <span className="text-black">監視者</span>
            </label>
          </div>

          {/* Error from server */}
          {state.error && (
            <div className="w-3/4 bg-red-300 p-2 rounded-md border border-red-700 text-red-950 mt-2">
              {state.error as string}
            </div>
          )}

          <button
            type="submit"
            className="flex w-3/4 bg-lime-green items-center justify-center p-2 rounded-md mt-3 text-white"
          >
            アカウント登録
          </button>

        </Form>

        <Link href="/login" className="text-ateneo-blue hover:font-bold">
          ログイン場面に戻ります
        </Link>
      </div>
    </div>
  )
}
