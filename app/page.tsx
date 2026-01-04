"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { RankedSchool } from "@/types/database"; 
import { Search, MapPin, ArrowRight, Loader2, GraduationCap } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RankedSchool[]>([]);
  const [loading, setLoading] = useState(false);

  // Sök-funktion
  useEffect(() => {
    const fetchSchools = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .from("final_rankings_9") 
        .select("*")
        .ilike("name", `%${query}%`)
        .limit(5);

      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(fetchSchools, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      
      <div className="text-center max-w-2xl w-full">
        <div className="mb-6 flex justify-center">
            <div className="p-4 bg-blue-600 rounded-full shadow-xl">
                <GraduationCap className="w-12 h-12 text-white" />
            </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-blue-900 mb-6 tracking-tight">
          Skolrank
        </h1>
        
        <p className="text-xl text-gray-600 mb-12">
          Hitta och jämför Sveriges grundskolor baserat på betyg, trygghet och lärarbehörighet.
        </p>

        {/* SÖKFÄLT */}
        <div className="relative max-w-lg mx-auto w-full">
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pl-12 rounded-2xl border-2 border-blue-100 shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg"
              placeholder="Sök på din skola..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-5 text-blue-400 w-6 h-6" />
            {loading && (
                <div className="absolute right-4 top-5">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                </div>
            )}
          </div>

          {/* SÖKRESULTAT DROPDOWN */}
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left">
              {results.map((school) => (
                <Link
                  key={school.school_unit_code}
                  href={`/skola/${school.school_unit_code}`}
                  className="block p-4 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-blue-700">
                        {school.name}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {school.municipality_name}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* LÄNKAR */}
        <div className="mt-16 flex flex-wrap justify-center gap-4 text-sm font-bold text-gray-500">
            <Link href="/topplistan" className="hover:text-blue-600 transition-colors">🏆 Topplistan</Link>
            <span>•</span>
            <Link href="/huvudman" className="hover:text-blue-600 transition-colors">🏢 Bästa Huvudmän</Link>
            <span>•</span>
            <Link href="/metod" className="hover:text-blue-600 transition-colors">📊 Vår Metod</Link>
        </div>

      </div>
    </main>
  );
}