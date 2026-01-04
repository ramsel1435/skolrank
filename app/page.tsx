"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { School } from "@/types/database";
import { Search } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      if (query.length < 2) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("schools")
        .select("school_unit_code, name, municipality_name")
        .ilike("name", `%${query}%`)
        .limit(10);

      if (!error && data) setSchools(data);
      setLoading(false);
    };

    const timer = setTimeout(fetchSchools, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 text-black">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Skolrank 🎓</h1>
        <p className="text-xl text-gray-600">Sveriges öppna skoldata.</p>
      </div>

      <div className="w-full max-w-xl relative">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Sök skola (t.ex. Adolf Fredrik...)"
            className="w-full p-4 pl-12 rounded-xl border border-gray-200 shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {(schools.length > 0 || loading) && query.length >= 2 && (
          <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10">
            {loading ? (
              <div className="p-4 text-gray-500">Laddar...</div>
            ) : (
              schools.map((school) => (
                <Link
                  key={school.school_unit_code}
                  href={`/skola/${school.school_unit_code}`}
                  className="block p-4 hover:bg-blue-50 border-b border-gray-50 last:border-none transition-colors"
                >
                  <p className="font-bold text-gray-900">{school.name}</p>
                  <p className="text-sm text-gray-500">{school.municipality_name}</p>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}