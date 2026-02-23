// app/api/add-to-waitlist/route.ts

import { supabase } from "@/lib/supabaseClient"; // Supabase client import
import { NextResponse } from "next/server"; // To handle responses

export async function POST(request: Request) {
  const { email, companyName, productId } = await request.json();

  // 1. Check if required data is present
  if (!email || !productId) {
    return NextResponse.json({ message: "Email and Product ID are required." }, { status: 400 });
  }

  // 2. Insert data into product_waitlist table
  const { data, error } = await supabase
    .from('product_waitlist')
    .insert([
      {
        product_id: productId,
        email: email,
        company_name: companyName || null,
        notified: false, // Initially, notification is false
      }
    ]);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { message: "You are already on the waitlist for this product." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Failed to insert into waitlist." },
      { status: 500 }
    );
  }

  // 3. Return success response
  return NextResponse.json({ message: "Successfully added to waitlist." });
}