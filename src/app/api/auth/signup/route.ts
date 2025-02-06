import { hash } from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }
  const hashedPassword = await hash(password, 10);
  const { 
    // data
    error } = await supabase.from("users").insert([
    { email, password: hashedPassword, name },
  ]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: "User registered" }), { status: 201 });
}