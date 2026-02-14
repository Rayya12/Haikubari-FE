import { cookies } from "next/headers";

const backendURL = process.env.BACKEND_URL!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") ?? "desc";

  const kukis = await cookies()

  const cToken = await kukis.get("access_token")?.value;
  if (!cToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const response = await fetch(`${backendURL}/all/topLike?sort=${encodeURIComponent(sort)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cToken}`,
      },
      cache: "no-store", 
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), { status: response.status });
    }

    return Response.json(data);
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message ?? "エラーが発生しました" }),
      { status: 500 }
    );
  }
}
