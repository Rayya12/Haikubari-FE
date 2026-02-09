import { cookies } from "next/headers";

const backendURL = process.env.BACKEND_URL!;

export async function GET() {
  const kukis = await cookies()
  const token = kukis.get("access_token")?.value;

  if (!token) {
    return Response.json({ error: "No token" }, { status: 401 });
  }

  const res = await fetch(`${backendURL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}


