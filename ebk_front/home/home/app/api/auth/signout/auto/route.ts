import { signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await signOut({ redirect: false });

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "/"));
}

