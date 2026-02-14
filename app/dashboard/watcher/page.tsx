"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { handleLogout } from "@/app/lib/action"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type LikeTopItem = {
  title: string
  likes: number
}

type CommentTopItem = {
  title: string
  review_count: number
}

const chartConfig = {
  value: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function WatcherDashboard() {
  const [mostLiked, setMostLiked] = useState<Array<{ label: string; value: number }>>([])
  const [mostCommented, setMostCommented] = useState<Array<{ label: string; value: number }>>([])
  const [loading, setLoading] = useState(true)
  const [sort,setSorted] = useState<"desc" | "asc">("desc")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [likeRes, commentRes] = await Promise.all([
          fetch(`/api/haiku/most-like?sort=${sort}`, { method: "GET", cache: "no-store" }),
          fetch(`/api/haiku/most-comments?sort=${sort}`, { method: "GET", cache: "no-store" }),
        ])

        if (!likeRes.ok) throw new Error("Failed to fetch most-like")
        if (!commentRes.ok) throw new Error("Failed to fetch most-comment")

        const likeJson: LikeTopItem[] = await likeRes.json()
        const commentJson: CommentTopItem[] = await commentRes.json()

        if (cancelled) return

        // Recharts data format: [{ label: "...", value: 123 }, ...]
        setMostLiked(
          likeJson.map((x) => ({
            label: x.title.length > 5 ? x.title.slice(0,5) + "..." : x.title ,
            value: x.likes,
          }))
        )

        setMostCommented(
          commentJson.map((x) => ({
            label: x.title.length > 5 ? x.title.slice(0,5) + "..." : x.title,
            value: x.review_count,
          }))
        )
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Unknown error")
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [sort])

  return (
    <div className="flex flex-col bg-white min-h-screen items-center justify-center">
        <h1 className="flex text-4xl font-bold text-ateneo-blue mb-8">監視者のダッシュボード</h1>
        <select onChange={(e)=>{setSorted(e.target.value as "desc" | "asc")}} name="sort" id="sort" className="bg-lime-green px-3 py-2 rounded-md text-white font-bold outline-0 text-2xl mb-4">
            <option value="desc">降順</option>
            <option value="asc">上昇</option>
        </select>
    
        {/* Most liked */}
        <div className="flex w-full space-x-4 items-center justify-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl">{sort == "desc" ? `最も多いいいねされた俳句`:`最も少ないいいねされた俳句`}</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="text-sm text-red-600">{error}</div>
            ) : (
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={mostLiked}
                  layout="vertical"
                  margin={{ left: 0 }}
                >
                  <XAxis type="number" dataKey="value" hide />
                  <YAxis className="font-bold text-xl"
                    dataKey="label"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    width={180}
                    tickFormatter={(value) =>
                      typeof value === "string" ? value.slice(0, 12) : String(value)
                    }
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={5} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>

          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              俳句張り実際データからとりました <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>

        {/* Most commented */}
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl">{sort == "desc" ?`最も多いコメントされた俳句` : "最も少ないコメントされた俳句"}</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="text-sm text-red-600">{error}</div>
            ) : (
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={mostCommented}
                  layout="vertical"
                  margin={{ left: 0 }}
                >
                  <XAxis type="number" dataKey="value" hide />
                  <YAxis
                  className="text-2xl font-bold"
                    dataKey="label"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    width={180}
                    tickFormatter={(value) =>
                      typeof value === "string" ? value.slice(0, 12) : String(value)
                    }
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={5} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>

          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              俳句張り実際データからとりました <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
    </div>
    <button onClick={handleLogout} className="bg-red-400 px-3 py-4 text-white font-bold rounded-sm mt-4">ログアウト</button>
    </div>
  )
}
