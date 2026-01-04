import { supabase } from "@/lib/supabaseClient";
import ToplistClient from "./ToplistClient";

// Samma logik som för profilsidan:
// Dev = 0 cache (lätt att utveckla)
// Prod = 3600 cache (sparar databas & bandbredd)
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export default async function ToplistPage() {
  
  // Hämta de första 50 skolorna (Åk 9 som default) på servern
  const { data: initialSchools } = await supabase
    .from("final_rankings_9")
    .select("*")
    .order("total_score", { ascending: false })
    .range(0, 49); // Batch size matchar klienten

  // Skicka datan till klientkomponenten
  return <ToplistClient initialSchools={initialSchools || []} />;
}