"use client"

import { useEffect, useState } from "react"
import { auth, getMe,PatchMe } from "../lib/action"
import { ImageKitUploadSuccess } from "../lib/type"

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!

export default function Profile() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)

  const [file,setFile] = useState<File | null>(null)
  const [preview,setPreview] = useState<string | null>(null)
  const [userName, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [address, setAddress] = useState("まだアドレスありません")
  const [bio, setBio] = useState("まだビオありません")
  const [photoUrl,setPhotoUrl] = useState("")
  const [fileType,setFileType] = useState("")
  const [fileName,setFileName] = useState("")

  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith("image/")){
      setErr("プロファイル画面はイメージしかできません")
      return
    }

    setErr(null)
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

 const handleEdit = async () => {
  setLoading(true)
  
  try {
    const authData = await auth()
    const formData = new FormData()
    
    if (file) {
      formData.append("file", file)
    
    
    formData.append("fileName", fileName)
    formData.append("publicKey", IMAGEKIT_PUBLIC_KEY)
    formData.append("token", authData.token)
    formData.append("signature", authData.signature)
    formData.append("expire", String(authData.expire))
    formData.append("folder", authData.folder)
    
    const uploadRes = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData
      }
    )
    
    const result = await uploadRes.json() as ImageKitUploadSuccess
    
    if (!uploadRes.ok) throw new Error("アプロード失敗しました")
    
    let nextPhotoUrl = photoUrl
    let nextFileName = fileName
    let nextFileType = fileType
    
    // If file was uploaded, use new values
    nextPhotoUrl = result.url
    nextFileName = result.name
    nextFileType = String(result.fileType)
    
    setPhotoUrl(nextPhotoUrl)
    setFileName(nextFileName)
    setFileType(nextFileType)

    // Use the next* variables here instead of state
    const response = await PatchMe(userName, nextPhotoUrl, nextFileName, nextFileType, bio, age, address)
    
    alert("Upload berhasil!")
    }else {
      const response = await PatchMe(userName,photoUrl,fileName,fileType,bio,age,address)
    }
    
    setErr(null)
    setEdit(false)
    
  } catch(e: any) {
    const errmessage = e?.message ?? "アプロードが失敗しました"
    setErr(errmessage)
  } finally {
    setLoading(false)
  }
}

  const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === ""){
      setErr("ユーサネームを入れて下さい")
    }
    if (value.length >= 0 && value.length<=15 ){
      setUsername(value)  
    }
     
  }

  const handleAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (Number(value) < 1){
      setErr("年齢は一以上です")
    }
    if (Number(value)>=1){
      setAge(value)  
    }
    
  }

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setErr(null)

      try {
        const response = await getMe()
        if (cancelled) return

        setUsername(String(response.username ?? ""))
        setEmail(String(response.email ?? ""))
        setFileName(String(response.file_name))
        setPhotoUrl(String(response.photo_url))
        setFileType(String(response.file_type))

        if (response.address) setAddress(String(response.address))
        if (response.bio) setBio(String(response.bio))

        // biar aman kalau age null/undefined
        setAge(response.age != null ? String(response.age) : "")
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "ユーザーが見つかりませんでした")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
  return () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
  }
  }, [preview])

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 min-w-0">
        {loading && (
          <div className="flex w-full items-center justify-center text-2xl font-bold text-black">
            ロード
          </div>
        )}

        {err && !loading && (
          <div className="mb-6 rounded-md border border-red-600 bg-red-50 px-4 py-3 text-red-700">
            {err}
          </div>
        )}

        {!loading && email && (
          <div className="min-w-0">
            {/* Header */}
            <div className="flex w-full items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="h-36 w-36 rounded-full bg-cover bg-center shrink-0 relative overflow-hidden"
                  style={{ backgroundImage: `url(${preview ?? photoUrl ?? "/loginBackground.png"})` }}
                >
                {edit && <> <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10"></input> <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium pointer-events-none">
                    Ganti Foto
                  </div></>}
                  
                </div>
                <input
                  type="text"
                  value={userName}
                  onChange={handleUserName}
                  className="min-w-0 w-full max-w-xl h-fit text-3xl font-bold text-black border-2 border-ateneo-blue disabled:border-0 px-3 py-2 rounded-md"
                  disabled={!edit}
                />
              </div>

              <div className="shrink-0">
                {!edit ? (
                  <button
                    className="rounded-md bg-lime-green px-6 py-4 font-bold text-white transition-colors hover:shadow-md"
                    onClick={() => setEdit(true)}
                  >
                    編集する
                  </button>
                ) : (
                  <button
                    className="rounded-md bg-ateneo-blue px-6 py-4 font-bold text-white transition-colors hover:shadow-md"
                    onClick={handleEdit}
                  >
                    編集済み
                  </button>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="mt-8 flex flex-col w-full min-w-0 gap-8">
              {/* row 1 */}
              <div className="flex w-full flex-wrap gap-8 min-w-0">
                <div className="min-w-[260px] flex-1">
                  <label htmlFor="email" className="block text-ateneo-blue mb-1 font-bold">
                    メール
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    readOnly
                    disabled
                    className="w-full px-3 py-4 border border-ateneo-blue rounded-md text-xl text-black"
                  />
                </div>

                <div className="min-w-[200px] w-[260px]">
                  <label htmlFor="age" className="block text-ateneo-blue mb-1 font-bold">
                    年齢
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={age}
                    onChange={handleAge}
                    disabled={!edit}
                    className="w-full px-3 py-4 border-2 border-ateneo-blue rounded-md text-xl text-black disabled:border disabled:border-ateneo-blue"
                  />
                </div>
              </div>

              {/* row 2 */}
              <div className="w-full min-w-0">
                <label htmlFor="address" className="block text-ateneo-blue mb-1 font-bold">
                  アドレス
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!edit}
                  className="w-full px-3 py-4 border-2 border-ateneo-blue rounded-md text-xl text-black disabled:border disabled:border-ateneo-blue"
                />
              </div>

              {/* row 3 (bio) */}
              <div className="w-full min-w-0">
                <label htmlFor="bio" className="block text-ateneo-blue mb-1 font-bold">
                  自己紹介
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!edit}
                  className="w-full min-h-32 px-3 py-4 border-2 border-ateneo-blue rounded-md text-xl text-black disabled:border disabled:border-ateneo-blue"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
