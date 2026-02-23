import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const productId = searchParams.get("productId");

  if (!email || !productId) {
    return NextResponse.json({ alreadyAdded: false });
  }

  const { data } = await supabase
    .from("product_waitlist")
    .select("id")
    .eq("email", email)
    .eq("product_id", productId)
    .single();

  return NextResponse.json({ alreadyAdded: !!data });
}