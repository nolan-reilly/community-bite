import { NextResponse } from "next/server";

// GET /api/ping
export async function GET(request: Request) {
  return NextResponse.json({ message: "pong" });
}

// POST /api/ping
export async function POST(request: Request) {
  const res = await request.json();
  const { name } = res;

  return NextResponse.json({ pong: name });
}
