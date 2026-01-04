import { supabase } from "@/lib/supabaseClient";
import OrganizerClient from "./OrganizerClient";
import { Metadata } from "next";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export const metadata: Metadata = {
  title: "Bästa Huvudmännen | Skolrank",
  description: "Totalrankning av Sveriges kommuner och friskolekoncerner.",
};

export default async function OrganizersPage() {
  
  // Hämta från den nya KOMBINERADE vyn
  const { data: initialOrganizers } = await supabase
    .from("organizers_ranking_combined")
    .select("*")
    .order("avg_total_score", { ascending: false })
    .range(0, 49);

  return <OrganizerClient initialOrganizers={initialOrganizers || []} />;
}