import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import SchoolProfileClient from "./SchoolProfileClient";

// --- CACHE-INSTÄLLNINGAR ---
// I Development (lokalt): 0 sekunder (alltid färsk data så du ser ändringar direkt).
// I Production (Vercel): 3600 sekunder (1 timme). Sidan byggs bara om en gång i timmen max.
// Detta sparar ENORMT på din databas och Vercel-kvot vid många besökare.
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

// Vi tar bort 'force-dynamic' eftersom 'revalidate' nu styr logiken.

export default async function SchoolPage({ params }: { params: { id: string } }) {
  // I Next.js 15 måste params awaitas
  const { id } = await params;

  // Hämta BÅDA nivåerna parallellt för att spara tid
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