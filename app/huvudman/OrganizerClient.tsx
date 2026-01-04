"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, Loader2, Building2, School } from "lucide-react";
import { RankedOrganizer } from "@/types/database";

interface OrganizerClientProps {
  initialOrganizers: RankedOrganizer[];
}

export default function OrganizerClient({ initialOrganizers }: OrganizerClientProps) {
  const [organizers, setOrganizers] = useState<RankedOrganizer[]>(initialOrganizers);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  
  const isFetching = useRef(false);
  const isFirstRender = useRef(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 1. HUVUDFUNKTION FÖR ATT HÄMTA DATA
  const fetchOrganizers = useCallback(async (currentLength: number, isReset: boolean = false) => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    setLoading(true);
    
    const BATCH_SIZE = 50;
    const from = isReset ? 0 : currentLength;
    const to = from + BATCH_SIZE - 1;
    
    // Nu hämtar vi ALLTID från den kombinerade vyn
    let query = supabase
      .from("organizers_ranking_combined")
      .select("*")
      .order("avg_total_score", { ascending: false })
      .range(from, to);

    if (search.trim()) {
      query = query.ilike('organizer_name', `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      if (data.length < BATCH_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      setOrganizers(prev => {
        if (isReset) return data;
        const newItems = data.filter(d => !prev.some(p => p.organizer_name === d.organizer_name));
        return [...prev, ...newItems];
      });
    }
    
    setLoading(false);
    isFetching.current = false;
  }, [search]); 

  // 2. TRIGGER: SÖKNING
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
        setOrganizers([]);
        setHasMore(true);
        fetchOrganizers(0, true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, fetchOrganizers]);

  // 3. INFINITE SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current && organizers.length > 0) {
          fetchOrganizers(organizers.length, false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, organizers.length, fetchOrganizers]);

  const sharedRanks = useMemo(() => {
    const counts = new Map<number, number>();
    organizers.forEach(org => {
      counts.set(org.rank, (counts.get(org.rank) || 0) + 1);
    });
    return counts;
  }, [organizers]);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 text-black font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-4 border border-indigo-100">
            <Building2 className="w-4 h-4" /> Huvudmän (Kommuner & Koncerner)
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Bästa Skolägarna 🏆</h1>
          <p className="text-gray-600 max-w-2xl">
            Totalrankning av Sveriges kommuner och friskolekoncerner. Baserat på genomsnittet av alla deras grundskolor (både mellan- och högstadium).
          </p>
        </div>

        {/* Sökfält */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Sök kommun eller koncern (t.ex. 'Academedia' eller 'Stockholm')..."
                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
        </div>

        {/* Tabellen */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 w-16 text-center">Rank</th>
                  <th className="p-4">Huvudman</th>
                  <th className="p-4 text-center text-black" title="Genomsnittlig Totalpoäng">Snitt</th>
                  <th className="p-4 text-center hidden md:table-cell text-blue-600 cursor-help" title="Akademiska Resultat">Resultat</th>
                  <th className="p-4 text-center hidden md:table-cell text-pink-600 cursor-help" title="Socioekonomisk Profil">Socio</th>
                  <th className="p-4 text-center hidden md:table-cell text-emerald-600 cursor-help" title="Studieklimat">Klimat</th>
                  <th className="p-4 text-center hidden md:table-cell text-violet-600 cursor-help" title="Lärarkår">Lärare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {organizers.map((org) => {
                  const isShared = (sharedRanks.get(org.rank) || 0) > 1;
                  
                  return (
                    <tr key={org.organizer_name} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="p-4 text-center font-mono font-bold text-gray-400 text-lg">
                        {isShared ? "=" : ""}{org.rank}
                      </td>
                      <td className="p-4 min-w-[250px]">
                        <div className="font-bold text-gray-900 text-lg block mb-1">
                          {org.organizer_name}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                            <Building2 className="w-3 h-3" /> {org.organizer_type}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <School className="w-3 h-3" /> {org.school_count} {org.school_count === 1 ? 'skola' : 'skolor'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white shadow-lg bg-indigo-600 shadow-indigo-200">
                          <span className="font-black text-lg">{org.avg_total_score}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center hidden md:table-cell font-medium text-gray-600">{org.avg_academic}</td>
                      <td className="p-4 text-center hidden md:table-cell font-medium text-gray-600">{org.avg_socio}</td>
                      <td className="p-4 text-center hidden md:table-cell font-medium text-gray-600">{org.avg_climate}</td>
                      <td className="p-4 text-center hidden md:table-cell font-medium text-gray-600">{org.avg_teachers}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {organizers.length === 0 && !loading && (
              <div className="p-12 text-center text-gray-500">
                Ingen huvudman hittades.
              </div>
            )}

            <div ref={observerTarget} className="p-8 flex justify-center items-center w-full">
               {loading && <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />}
               {!loading && !hasMore && organizers.length > 0 && (
                 <span className="text-gray-400 text-sm">Slut på listan</span>
               )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}