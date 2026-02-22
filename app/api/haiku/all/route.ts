import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const backendURL = process.env.BACKEND_URL!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const kukis = await cookies();

  const token = kukis.get("access_token")?.value; // opsional

  const url = `${backendURL}/haikus/?${searchParams.toString()}`;

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}