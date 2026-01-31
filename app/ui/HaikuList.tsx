"use client"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState,useMemo, useEffect } from "react";
import { Haiku,MyHaikusResponse } from "../lib/type";
import { getMyHaikus } from "../lib/action";
import { json } from "stream/consumers";
import HaikuCard from "@/app/ui/HaikuCard";
import Link from "next/link";
import { Pavanam } from "next/font/google";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function MyHaikuPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const page = Number(sp.get("page") ?? "1");
  const pageSize = Number(sp.get("page_size") ?? "8");
  const q = sp.get("q") ?? "";
  const sort = (sp.get("sort") ?? "created_at") as "created_at" | "likes";
  const order = (sp.get("order") ?? "desc") as "asc" | "desc";

  const [data, setData] = useState<MyHaikusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(q);


  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const json = await getMyHaikus({ page:page, page_size: pageSize, q: q || undefined, sort:sort, order:order });
        console.log("Fetched my haikus:", json);
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, q, sort, order]);

  function setParams(next: Partial<{ page: number; page_size: number; q: string; sort: "created_at" | "likes"; order: "asc" | "desc" }>) {
    const params = new URLSearchParams(sp.toString());

    if (next.page !== undefined) params.set("page", String(next.page));
    if (next.page_size !== undefined) params.set("page_size", String(next.page_size));
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.sort !== undefined) params.set("sort", next.sort);
    if (next.order !== undefined) params.set("order", next.order);

    router.push(`?${params.toString()}`);
  }

  const totalPages = data?.total_pages ?? 0;
  const safePage = totalPages ? clamp(page, 1, totalPages) : page;

  // simple pagination window (maks 5 tombol)
  const pageButtons = useMemo(() => {
    const tp = totalPages;
    if (!tp) return [];
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, safePage - half);
    let end = Math.min(tp, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, safePage]);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:mb-15">
        <div>
          <h1 className="text-2xl font-bold text-ateneo-blue">自分の俳句</h1>
          <p className="text-sm text-teal-Deer">
            {data ? `${data.total} 件` : "—"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex gap-2">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="検索 (title / 5-7-5)"
              className="w-full md:w-64 rounded-md border border-ateneo-blue bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ateneo-blue text-black"
            />
            <button
              onClick={() => setParams({ q: searchInput, page: 1 })}
              className="rounded-md border border-ateneo-blue bg-ateneo-blue px-3 py-2 text-sm hover:bg-black text-white"
            >
              検索
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => setParams({ sort: e.target.value as any, page: 1 })}
              className="rounded-md border border-ateneo-blue bg-white px-3 py-2 text-sm text-ateneo-blue"
            >
              <option value="created_at">新しい順</option>
              <option value="likes">いいね順</option>
            </select>

            <select
              value={order}
              onChange={(e) => setParams({ order: e.target.value as any, page: 1 })}
              className="rounded-md border border-ateneo-blue bg-white px-3 py-2 text-sm text-ateneo-blue"
            >
              <option value="desc">desc</option>
              <option value="asc">asc</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => setParams({ page_size: Number(e.target.value), page: 1 })}
              className="rounded-md border border-ateneo-blue bg-white px-3 py-2 text-sm text-ateneo-blue"
            >
              {[8, 12, 16].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>

            <Link href={"/dashboard/common/haiku/mine/create"} className="rounded-md bg-lime-green px-3 py-2 text-sm text-white font-bold">
                俳句を作成
            </Link>
          </div>
        </div>
      </div>

      

      {/* States */}
      {err && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading && (
        <div className="text-sm text-slate-500">Loading...</div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(data?.items ?? []).map((h) => (
          <HaikuCard
            key={h.id}
            id={h.id}
            title={h.title}
            line1={h.hashigo}
            line2={h.nakasichi}
            line3={h.shimogo}
          />
        ))}
      </div>

      {/* Empty */}
      {!loading && data && data.items.length === 0 && (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          まだ俳句がありません
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={safePage <= 1}
            onClick={() => setParams({ page: safePage - 1 })}
            className="rounded-md border bg-ateneo-blue px-3 py-2 text-sm disabled:opacity-40"
          >
            前へ
          </button>

          {pageButtons[0] !== 1 && (
            <>
              <button
                onClick={() => setParams({ page: 1 })}
                className= {`rounded-md border px-3 py-2 text-sm ${page === 1 ? "bg-ateneo-blue":"bg-lime-green"}`}
              >
                1
              </button>
              <span className="px-1 text-black">…</span>
            </>
          )}

          {pageButtons.map((p) => (
            <button
              key={p}
              onClick={() => setParams({ page: p })}
              className={`rounded-md border px-3 py-2 text-sm ${
                p === safePage
                  ? "bg-ateneo-blue text-white"
                  : "bg-lime-green text-white"
              }`}
            >
              {p}
            </button>
          ))}

          {pageButtons[pageButtons.length - 1] !== totalPages && (
            <>
              <span className="px-1 text-black">…</span>
              <button
                onClick={() => setParams({ page: totalPages })}
                className={`rounded-md border px-3 py-2 text-sm ${page === totalPages ? "bg-ateneo-blue":"bg-lime-green"}`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={safePage >= totalPages}
            onClick={() => setParams({ page: safePage + 1 })}
            className="rounded-md border bg-ateneo-blue px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}