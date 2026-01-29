'use client'

import { useRouter } from "next/navigation";
import HaikuCard from "./HaikuCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MyHaikusResponse } from "../lib/type";
import { getAllHaikus } from "../lib/action";


function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}


export default function AllHaikuList() {
    const router = useRouter();
    const sp = useSearchParams();

    const page = Number(sp.get("page")?? "1")
    const pageSize = Number(sp.get("page_size")?? "8")
    const q = sp.get("q")?? ""
    const sort = (sp.get("sort") ?? "created_at") as "created_at" | "likes"
    const order = (sp.get("order")??"desc") as "asc" | "desc"

    const [data,setData] = useState<MyHaikusResponse | null>(null);
    const [loading,setLoading] = useState(false);
    const [err,setErr] = useState<string | null>(null);
    const [searchInput,setSearchInput] = useState(q);

    useEffect(() => {
        let cancelled = false;

        async function run(){
            setLoading(true);
            setErr(null);
            try{
                const json = await getAllHaikus({page:page,page_size:pageSize,q:q || undefined,sort:sort,order:order});
                if (!cancelled) setData(json);
            }catch(e:any){
                if (!cancelled) setErr(e?.message ?? "failed to load");
            }finally{
                if (!cancelled) setLoading(false);
            }
        }
        run();
        return () => {
            cancelled = true;
        }
    }, [page,pageSize,q,sort,order]);

    function setParams(next:Partial<{page:number;page_size:number;q:string;sort:"created_at" | "likes";order:"asc" | "desc"}>){
        const params = new URLSearchParams(sp.toString());
        if (next.page !== undefined) params.set("page",String(next.page));
        if (next.page_size ! == undefined) params.set("page_size",String(next.page_size));
        if (next.q !== undefined){
            if (next.q) params.set("q",next.q);
            else params.delete("q");
        }
        if (next.sort !== undefined) params.set("sort",next.sort);
        if (next.order !== undefined) params.set("order",next.order);
        router.push(`?${params.toString()}`);
    }

    const totalPages = data ? data.total_pages:0;
    const safePage = clamp(page,1,totalPages);

    const pageButtons = useMemo(()=>{
        const tp = totalPages;
        if (!tp) return [];
        const WINDOW_SIZE = 5;
        const half = Math.floor(WINDOW_SIZE / 2);
        let start = Math.max(1,safePage - half);
        let end = Math.min(tp,start + WINDOW_SIZE-1);
        start = Math.max(1,end - WINDOW_SIZE + 1);
        return Array.from({length:end - start + 1},(_,i) => start + i);
    }, [safePage,totalPages]);

    return(
        <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:mb-15">
        <div>
          <h1 className="text-2xl font-bold text-ateneo-blue">全ての俳句</h1>
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
              className="rounded-md border border-ateneo-blue bg-white px-3 py-2 text-sm hover:bg-slate-300 text-ateneo-blue"
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

          </div>
        </div>
      </div>

      

      {/* States */}
      {err && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      </div>)
    
}