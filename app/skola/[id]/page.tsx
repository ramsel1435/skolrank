import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import SchoolProfileClient from "./SchoolProfileClient";

// Tvinga dynamisk rendering så vi alltid får färsk data
export const dynamic = "force-dynamic";

export default async function SchoolPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Hämta BÅDA nivåerna parallellt
  const [res9, res6] = await Promise.all([
    supabase.from("final_rankings_9").select("*").eq("school_unit_code", id).single(),
    supabase.from("final_rankings_6").select("*").eq("school_unit_code", id).single()
  ]);

  const school9 = res9.data;
  const school6 = res6.data;

  // Om skolan inte finns i någon av listorna -> 404
  if (!school9 && !school6) return notFound();

  // Skicka datan till klient-komponenten
  return <SchoolProfileClient school9={school9} school6={school6} />;
}