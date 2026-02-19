"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleLogout } from "@/app/lib/action";
import { userResponse } from "@/app/lib/type";
import { stat } from "fs";

const STATUS_OPTIONS = ["pending", "accepted", "suspended"];

const statusStyle = (status: any) => {
  switch ((status || "").toLowerCase()) {
    case "accepted":
      return "bg-green-500 text-white";
    case "suspend":
    case "suspended":
      return "bg-rose-500 text-white";
    case "pending":
    default:
      return "bg-yellow-400 text-gray-900";
  }
};

export default function ListWatcher() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || "";
  const [input, setInput] = useState(q);

  const [watcher, setWatcher] = useState<userResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // ✅ only disable the button that is clicked
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleButtonLogout = async () => {
    await handleLogout();
  };

  // ✅ Client-side navigation (no redirect() in client component)
  const handleSearch = () => {
    const trimmed = input.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (trimmed === "") {
      params.delete("q");
      router.push("/dashboard/admin");
      return;
    }

    params.set("q", trimmed);
    router.push(`/dashboard/admin?q=${encodeURIComponent(trimmed)}`);
  };

  useEffect(() => {
    setInput(q);
  }, [q]);

  // ✅ Fetch watchers
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setErrMsg("");

      try {
        const response = await fetch(`/api/admin/getAllWatcher?q=${q}`, {
          method: "GET",
          cache: "no-store",
        });

        // 🔒 avoid response.json() crash when body is empty/non-json
        const contentType = response.headers.get("content-type") || "";
        const maybeJson =
          contentType.includes("application/json") ? await response.json() : null;

        if (!response.ok) {
          const msg =
            maybeJson?.message ??
            maybeJson?.detail ??
            "データをロードできませんでした";
          if (active) setErrMsg(msg);
          return;
        }

        const listWatcher = maybeJson?.wachers ?? [];
        if (active) setWatcher(listWatcher);
      } catch (e: any) {
        if (active) setErrMsg(e?.message ?? "データをロードできませんでした");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [q]);

  // ✅ Change status with per-row loading
  const handleChangeStatus = async (id: string, email: string, status: string) => {
    setErrMsg("");
    setLoadingId(id);

    try {
      const response = await fetch("/api/admin/changeStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, email, status }),
      });

      // 🔒 avoid response.json() crash
      const contentType = response.headers.get("content-type") || "";
      const maybeJson =
        contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        const msg =
          maybeJson?.message ??
          maybeJson?.detail ??
          "ステータス変更に失敗しました";
        setErrMsg(msg);
        return;
      }

      alert("ステータス変化がせいこうしました！");

      setWatcher(prev => prev.map((e)=>e.id == id ? {...e,status} : e))
    } catch (e: any) {
      setErrMsg(e?.message ?? "ステータス変更に失敗しました");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-textBase transition-colors duration-300">
      {/* Header */}
      <header className="bg-header shadow-md bg-lime-green">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/blacklogo.png" alt="GetTentor" className="h-8" />
          </div>
          <div className="flex items-center p-2 gap-4">
            <div className="text-textBase font-semibold">アドミン</div>
            <button
              onClick={handleButtonLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex justify-center mt-6">
        <input
          type="text"
          placeholder="監視者を探す"
          className="w-[400px] px-4 py-2 border border-border rounded-l-md shadow-sm bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta transition-colors duration-200"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button
          className="bg-ateneo-blue hover:bg-gray-800 text-white px-4 py-2 rounded-r-md font-semibold transition-colors duration-200 hover:shadow-md"
          onClick={handleSearch}
        >
          検索 🔍
        </button>
      </div>

      {/* Body */}
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <h2 className="text-3xl font-semibold mb-4 text-cta">
          {q ? `探す結果はこちら "${q}"` : "監視者のリスト"}
        </h2>

        {errMsg && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {errMsg}
          </div>
        )}

        {loading ? (
          <div className="flex h-48 items-center justify-center text-textMuted">
            ロードする
          </div>
        ) : watcher.length === 0 ? (
          <div className="text-textMuted">監視者はまだいません</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {watcher.map((t) => {
              const isBtnLoading = loadingId === t.id;

              const baseBtn =
                "flex px-2 py-3 font-bold text-white rounded-md transition-colors";
              const disabledBtn = "bg-gray-400 cursor-not-allowed";
              const acceptBtn = "bg-lime-green hover:bg-lime-700";
              const suspendBtn = "bg-red-400 hover:bg-red-700";

              return (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-2xl border border-border bg-white dark:bg-slate-900 px-4 py-4 shadow-sm transition-colors duration-300"
                >
                  {/* Left: info */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="min-w-[220px] font-semibold text-textBase">
                      {t.username}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-textMuted">監視者のステータス:</span>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${statusStyle(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-3">
                    {t.status === "pending" && (
                      <button
                        disabled={isBtnLoading}
                        className={`${baseBtn} ${
                          isBtnLoading ? disabledBtn : acceptBtn
                        }`}
                        onClick={() =>
                          handleChangeStatus(t.id, t.email.toString(), "accepted")
                        }
                      >
                        {isBtnLoading ? "処理中..." : "承認します。"}
                      </button>
                    )}

                    {t.status === "accepted" && (
                      <button
                        disabled={isBtnLoading}
                        className={`${baseBtn} ${
                          isBtnLoading ? disabledBtn : suspendBtn
                        }`}
                        onClick={() =>
                          handleChangeStatus(
                            t.id,
                            t.email.toString(),
                            "suspended"
                          )
                        }
                      >
                        {isBtnLoading ? "処理中..." : "中断します。"}
                      </button>
                    )}

                    {t.status === "suspended" && (
                      <button
                        disabled={isBtnLoading}
                        className={`${baseBtn} ${
                          isBtnLoading ? disabledBtn : acceptBtn
                        }`}
                        onClick={() =>
                          handleChangeStatus(t.id, t.email.toString(), "accepted")
                        }
                      >
                        {isBtnLoading ? "処理中..." : "承認します。"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
