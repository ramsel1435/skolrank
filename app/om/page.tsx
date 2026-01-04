import { supabase } from "@/lib/supabaseClient";
import { Metadata } from "next";
import { Code2, Database, Mail, Heart, CalendarClock, Info } from "lucide-react";

// Cache-inställning: 0 i dev, 1h i prod
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export const metadata: Metadata = {
  title: "Om Skolrank",
  description: "Ett hobbyprojekt för ökad transparens i skolan.",
};

// Formaterar t.ex. 2024 -> "23/24"
const formatAcademicYear = (val: any) => {
  const year = Number(val);
  if (isNaN(year) || year === 0) return val;
  const startYear = (year - 1).toString().slice(-2);
  const endYear = year.toString().slice(-2);
  return `${startYear}/${endYear}`;
};

export default async function AboutPage() {
  
  // 1. Senast uppdaterad (Schools)
  const { data: schoolsData } = await supabase
    .from("schools")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // 2. BETYG: Använd RPC-funktionen (Bypass API limits)
  const { data: gradesYears, error: gradesError } = await supabase.rpc('get_grade_years');
  
  if (gradesError) console.error("Error fetching grade years:", gradesError);
  
  const gradesList = gradesYears?.map((r: any) => r.year) || [];
  const gradesString = gradesList.map((y: number) => formatAcademicYear(y)).join(", ");

  // 3. ENKÄT: Använd RPC-funktionen (Bypass API limits)
  const { data: surveyYears, error: surveyError } = await supabase.rpc('get_survey_years');
  
  if (surveyError) console.error("Error fetching survey years:", surveyError);

  const surveyList = surveyYears?.map((r: any) => r.year) || [];
  const surveyString = surveyList.join(" & ");

  // Datumformatering
  const lastUpdateDate = schoolsData?.created_at 
    ? new Date(schoolsData.created_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })
    : "Okänt datum";

  return (
    <main className="min-h-screen bg-gray-50 text-black font-sans pb-24">
      
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-sm font-bold mb-6 border border-pink-100">
            <Heart className="w-4 h-4" /> Ideellt Hobbyprojekt
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">
            Om Skolrank
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Skolrank är ett privat initiativ för att göra offentlig skolstatistik mer tillgänglig, jämförbar och begriplig för föräldrar och elever.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-12 space-y-12">
        
        {/* AKTUELL DATA */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <CalendarClock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Aktuell data</h2>
            </div>
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <span className="block font-bold text-gray-900 text-sm">Skolverkets statistik (Betyg & Lärare)</span>
                        <span className="text-xs text-gray-500">Innefattar kategorierna: Akademiska resultat, Socioekonomi & Lärarkår</span>
                    </div>
                    <div className="mt-2 sm:mt-0 font-mono font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded text-sm">
                        Läsår: {gradesString || "Laddar..."}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <span className="block font-bold text-gray-900 text-sm">Skolinspektionens Enkät</span>
                        <span className="text-xs text-gray-500">Innefattar kategorin: Studieklimat (Trygghet & Studiero)</span>
                    </div>
                    <div className="mt-2 sm:mt-0 font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded text-sm">
                        År: {surveyString || "Laddar..."}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <span className="block font-bold text-gray-900 text-sm">Skolenhetsregistret</span>
                        <span className="text-xs text-gray-500">Grunddata om skolor, huvudmän och kommuner</span>
                    </div>
                    <div className="mt-2 sm:mt-0 text-xs font-medium text-gray-500">
                        Senast uppdaterat: {lastUpdateDate}
                    </div>
                </div>
            </div>
        </section>

        {/* TECH STACK */}
        <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-gray-500" />
                Teknik & Drift
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Sajten är byggd med modern webbteknik för att vara snabb och kostnadseffektiv. Eftersom projektet drivs ideellt utan vinstintresse används molntjänster med generösa gratisnivåer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                    <div className="p-2 bg-gray-900 text-white rounded-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M24 22.525H0l12-21.05 12 21.05z" /></svg>
                    </div>
                    <div>
                        <strong className="block text-gray-900 text-sm">Vercel</strong>
                        <span className="text-xs text-gray-500">Hosting & Serverless</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                    <div className="p-2 bg-emerald-500 text-white rounded-lg">
                        <Database className="w-6 h-6" />
                    </div>
                    <div>
                        <strong className="block text-gray-900 text-sm">Supabase</strong>
                        <span className="text-xs text-gray-500">Databas (PostgreSQL)</span>
                    </div>
                </div>
            </div>
        </section>

        {/* KONTAKT / DISCLAIMER */}
        <section className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 mb-12">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full mt-1 shrink-0">
                    <Info className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 mb-2">Hittat fel i datat?</h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Viss data kan saknas för enskilda skolor om de inte rapporterat in statistik korrekt till myndigheterna, eller om elevunderlaget är för litet för att redovisas (sekretess). Detta leder tyvärr till att skolan får 0 poäng i den kategorin.
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-6">
                        Eftersom detta är ett hobbyprojekt har jag begränsad möjlighet att svara på allmänna frågor, men rapportera gärna uppenbara tekniska fel eller oregelbundenheter i databasen.
                    </p>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>kontakt [snabel-a] skolrank.se</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                        (Ersätt [snabel-a] med @ för att maila)
                    </p>
                </div>
            </div>
        </section>

      </div>
    </main>
  );
}