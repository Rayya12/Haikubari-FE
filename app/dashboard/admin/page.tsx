import { useEffect, useState } from "react";
import {useRouter, useSearchParams } from "next/navigation";
import { handleLogout } from "@/app/lib/action";
import { redirect } from "next/navigation";



const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

const statusStyle = (status : any) => {
  switch ((status || "").toLowerCase()) {
    case "approved":
      return "bg-green-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    case "suspend":
    case "suspended":
      return "bg-rose-500 text-white";
    case "pending":
    default:
      return "bg-yellow-400 text-gray-900";
  }
};

export default function ListTentor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const [input, setInput] = useState(q);

  const [watcher, setWatcher] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const handleButtonLogout = async () => {
    await handleLogout()
  };

  const handleSearch = () => {
    const trimmed = input.trim();
    if (trimmed === "") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q")
      redirect("/dashboard/admin");
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q",trimmed)
      redirect(`/dashboard/admin?q=${encodeURIComponent(trimmed)}`);
    }
  };

  useEffect(() => {
    setInput(q);
  }, [q]);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrMsg("");

        
      } catch (e:any) {
        console.error(e);
        setErrMsg(
          e?.message || "監視者のデータがロードできませんでした"
        );
      } finally {
        active && setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [q]);

  const handleChangeStatus = async (id, newStatus) => {
    const prev = tentors;
    setTentors((s) =>
      s.map((x) => (x.id === id ? { ...x, status: newStatus } : x))
    );
    try {
      await axios.post(
        `${BACKEND_URL}/api/tentors/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (e) {
      console.error(e);
      setErrMsg(
        e?.response?.data?.message || "Gagal mengubah status verifikasi."
      );
      setTentors(prev);
    }
  };



  return (
    <div className="min-h-screen bg-bg text-textBase transition-colors duration-300">
      {/* Header */}
      <header className="bg-header shadow-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/images/gettentor.png" alt="GetTentor" className="h-8" />
          </div>
          <div className="flex items-center p-2 gap-4">
            <div className="text-textBase font-semibold">Admin</div>
            <button
              onClick={handleButtonLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex justify-center mt-6">
        <input
          type="text"
          placeholder="Masukkan kata kunci yang ingin dicari"
          className="w-[400px] px-4 py-2 border border-border rounded-l-md shadow-sm bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta transition-colors duration-200"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button
          className="bg-cta hover:bg-ctaSoft text-white px-4 py-2 rounded-r-md font-semibold transition-colors duration-200"
          onClick={handleSearch}
        >
          検索 🔍
        </button>
      </div>

      {/* Body */}
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <h2 className="text-3xl font-semibold mb-4 text-cta">
          {q ? `Hasil Pencarian untuk "${q}"` : "List Tentor"}
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
        ) : tentors.length === 0 ? (
          <div className="text-textMuted">Belum ada data tentor.</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {tentors.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-white dark:bg-slate-900 px-4 py-4 shadow-sm transition-colors duration-300"
              >
                {/* Left: info */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="min-w-[220px] font-semibold text-textBase">
                    {t.name}
                  </div>
                  <div className="text-textMuted">
                    <span className="font-medium">IPK:</span>{" "}
                    {Number(t.ipk || 0).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-textMuted">
                      監視者のステータス:
                    </span>
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

                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}