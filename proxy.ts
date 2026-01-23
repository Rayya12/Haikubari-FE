import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const backendURL = process.env.BACKEND_URL

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value
  const { pathname } = request.nextUrl

  // belum login
  if (!token) {
    if (pathname !== "/login" && pathname !== "/register" && pathname!== "/verify-otp/success") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  // sudah login -> cek user ke backend
  const res = await fetch(`${backendURL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  if (!res.ok) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    // optional: sekalian hapus cookie rusak
    response.cookies.delete("access_token")
    return response
  }

  const user = await res.json()

  if (!user.is_verified && pathname !== "/verify-otp") {
    return NextResponse.redirect(
      new URL(`/verify-otp?email=${encodeURIComponent(user.email)}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/verify-otp"],
}
