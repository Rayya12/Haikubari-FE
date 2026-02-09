'use client'

import { useState } from "react"

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!

export default function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith("image/")) {
      setError("File harus berupa gambar")
      return
    }

    setError(null)
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)

    try {
      // 1️⃣ ambil auth dari FastAPI
      const authRes = await fetch(`${backendURL}/imagekit/auth`, {
        credentials: "include"
      })

      if (!authRes.ok) {
        throw new Error("Gagal ambil auth ImageKit")
      }

      const auth = await authRes.json()

      // 2️⃣ upload ke ImageKit
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", file.name)
      formData.append("publicKey", IMAGEKIT_PUBLIC_KEY)
      formData.append("token", auth.token)
      formData.append("signature", auth.signature)
      formData.append("expire", auth.expire)
      formData.append("folder", auth.folder)

      const uploadRes = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData
        }
      )

      const result = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(result?.message ?? "Upload gagal")
      }

      console.log("Upload success:", result)
      alert("Upload berhasil!")

    } catch (err: any) {
      setError(err.message ?? "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm p-4 border rounded-md">
      <h2 className="text-lg font-bold">Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm"
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-40 h-40 object-cover rounded-md border"
        />
      )}

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  )
}
