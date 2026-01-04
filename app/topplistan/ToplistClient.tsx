"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { RankedSchool } from "@/types/database";
import { MapPin, Search, Filter, X, Building2, ChevronDown, Check, Loader2, GraduationCap, Backpack, AlertTriangle } from "lucide-react";

interface ToplistClientProps {
  initialSchools: RankedSchool[];
}

export default function ToplistClient({ initialSchools }: ToplistClientProps) {
  const [activeTab, setActiveTab] = useState<'9' | '6'>('9');
  const [schools, setSchools] = useState<RankedSchool[]>(initialSchools);
  
  // UI-state för laddning (för att visa spinner)
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Ref för att hålla koll på laddning UTAN att trigga re-renders (LÖSER LOOPEN)
  const isFetching = useRef(false);
  
  // Ref för att hindra dubbel-fetch vid första laddning
  const isFirstRender = useRef(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);
  
  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [allMunicipalities, setAllMunicipalities] = useState<string[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 1. HÄMTA KOMMUNLISTA
  useEffect(() => {
    const fetchMunicipalities = async () => {
      const { data } = await supabase.from("schools").select("municipality_name");
      if (data) {
        const unique = Array.from(new Set(data.map(d => d.municipality_name))).sort();
        setAllMunicipalities(unique);
      }
    };
    fetchMunicipalities();
  }, []);

  // 2. HUVUDFUNKTION FÖR ATT HÄMTA DATA
  const fetchSchools = useCallback(async (currentLength: number, isReset: boolean = false) => {
    // Använd ref för att stoppa dubbla anrop
    if (isFetching.current) return;
    
    isFetching.current = true;
    setLoading(true);
    
    const BATCH_SIZE = 50;
    const from = isReset ? 0 : currentLength;
    const to = from + BATCH_SIZE - 1;
    const tableName = activeTab === '9' ? "final_rankings_9" : "final_rankings_6";

    let query = supabase
      .from(tableName)
      .select("*")
      .order("total_score", { ascending: false })
      .range(from, to);

    if (search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }
    
    if (selectedMunicipalities.length > 0) {
      query = query.in('municipality_name', selectedMunicipalities);
    }

    const { data, error } = await query;

    if (!error && data) {
      if (data.length < BATCH_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      setSchools(prev => {
        if (isReset) return data;
        // Filtrera dubbletter
        const newSchools = data.filter(d => !prev.some(p => p.school_unit_code === d.school_unit_code));
        return [...prev, ...newSchools];
      });
    }
    
    setLoading(false);
    isFetching.current = false;
    
    // VIKTIGT: Inga 'loading' eller 'isFetching' i dependency arrayen här!
  }, [activeTab, search, selectedMunicipalities]); 

  // 3. TRIGGER: FILTER/TAB ÄNDRING (Sökning)
  useEffect(() => {
    // Hoppa över den allra första körningen (mount) eftersom vi redan har initialSchools
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
        setSchools([]); // Rensa listan
        setHasMore(true);
        fetchSchools(0, true); // Hämta nytt
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, selectedMunicipalities, activeTab, fetchSchools]);

  // 4. INFINITE SCROLL (Ladda mer när man scrollar längst ner)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // Kolla isFetching.current istället för loading state
        if (entries[0].isIntersecting && hasMore && !isFetching.current && schools.length > 0) {
          fetchSchools(schools.length, false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, schools.length, fetchSchools]); // Tog bort loading härifrån också

  // --- RENDERINGS LOGIK (Samma som förut) ---

  const sharedRanks = useMemo(() => {
    const counts = new Map<number, number>();
    schools.forEach(school => {
      if (school.rank) {
        counts.set(school.rank, (counts.get(school.rank) || 0) + 1);
      }
    });
    return counts;
  }, [schools]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = allMunicipalities.filter(m => 
    m.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  const toggleMunicipality = (municipality: string) => {
    if (selectedMunicipalities.includes(municipality)) {
      setSelectedMunicipalities(prev => prev.filter(m => m !== municipality));
    } else {
      setSelectedMunicipalities(prev => [...prev, municipality]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 text-black font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Topplistan 🏆</h1>
          <p className="text-gray-600 max-w-2xl">
            Sveriges skolor rankade efter totalpoäng. Välj nivå nedan.
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex p-1 bg-gray-200 rounded-xl w-fit mb-8 shadow-inner">
            <button
                onClick={() => setActiveTab('9')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === '9' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <GraduationCap className="w-4 h-4" />
                Högstadiet (Åk 9)
            </button>
            <button
                onClick={() => setActiveTab('6')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === '6' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Backpack className="w-4 h-4" />
                Mellanstadiet (Åk 6)
            </button>
        </div>

        {/* Filter-sektion */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            
            {/* Sökfält */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Sök skola..."
                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                className={`w-full text-left pl-10 p-3 border rounded-xl flex items-center justify-between outline-none transition-colors ${isDropdownOpen ? 'border-blue-500 ring-2 ring-blue-100 bg-white' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                   <Filter className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                   <span className={selectedMunicipalities.length === 0 ? "text-gray-500" : "text-gray-900 font-medium"}>
                     {selectedMunicipalities.length === 0 
                       ? "Välj kommuner..." 
                       : `${selectedMunicipalities.length} valda`}
                   </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-80">
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <input 
                      type="text" 
                      placeholder="Sök..." 
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                      value={dropdownSearch}
                      onChange={(e) => setDropdownSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  
                  <div className="overflow-y-auto flex-1 p-2">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map(m => {
                        const isSelected = selectedMunicipalities.includes(m);
                        return (
                          <div 
                            key={m} 
                            onClick={() => toggleMunicipality(m)}
                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer text-sm transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            {m}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">Inga kommuner hittades</div>
                    )}
                  </div>
                  
                  {selectedMunicipalities.length > 0 && (
                  <div className="p-2 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                    <span>{selectedMunicipalities.length} valda</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedMunicipalities([]); }}
                        className="text-red-600 hover:underline"
                      >
                        Rensa
                      </button>
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedMunicipalities.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 mt-2">
              <span className="text-sm text-gray-500 self-center mr-2">Valda:</span>
              {selectedMunicipalities.map(m => (
                <button 
                  key={m} 
                  onClick={() => toggleMunicipality(m)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  {m} <X className="w-3 h-3" />
                </button>
              ))}
              <button 
                onClick={() => setSelectedMunicipalities([])}
                className="text-xs text-gray-400 hover:text-red-500 underline self-center ml-2"
              >
                Rensa alla
              </button>
            </div>
          )}
        </div>

        {/* Tabellen */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 w-16 text-center">Rank</th>
                  <th className="p-4">Skola</th>
                  <th className="p-4 text-center text-black" title="Sammanvägd Totalpoäng">Total</th>
                  <th className="p-4 text-center hidden md:table-cell text-blue-600 cursor-help" title="Akademiska Resultat (55%)">Resultat</th>
                  <th className="p-4 text-center hidden md:table-cell text-pink-600 cursor-help" title="Socioekonomisk Profil (20%)">Socio</th>
                  <th className="p-4 text-center hidden md:table-cell text-emerald-600 cursor-help" title="Studieklimat (15%)">Klimat</th>
                  <th className="p-4 text-center hidden md:table-cell text-violet-600 cursor-help" title="Lärarkår & Resurser (10%)">Lärare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {schools.map((school) => {
                  const isShared = (school.rank && (sharedRanks.get(school.rank) || 0) > 1);
                  
                  return (
                    <tr key={school.school_unit_code} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="p-4 text-center font-mono font-bold text-gray-400 text-lg">
                        {isShared ? "=" : ""}{school.rank || "-"}
                      </td>
                      <td className="p-4 min-w-[200px]">
                        <Link href={`/skola/${school.school_unit_code}`} className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors block mb-1">
                          {school.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {school.municipality_name}</span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {school.organizer_type || "Annat"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-white shadow-lg ${activeTab === '9' ? 'bg-gray-900 shadow-gray-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
                          <span className="font-black text-lg">{school.total_score}</span>
                        </div>
                      </td>

                      {/* AKADEMISKA RESULTAT */}
                      <td className="p-4 text-center hidden md:table-cell font-medium text-gray-600">
                        <div className="flex items-center justify-center gap-1.5">
                            {school.score_academic}
                            {school.has_inflation_penalty && (
                                <div title="Poängavdrag gjort p.g.a. betygsinflation (-15%)">
                                    <AlertTriangle 
                                        className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition-colors cursor-help" 
                                    />
                                </div>
                            )}
                        </div>
                      </td>

                      <td className="p-4 text-center hidden md:table-cell font-medium text-gray-600">{school.score_socio}</td>
                      <td className="p-4 text-center hidden md:table-cell font-medium text-gray-600">{school.score_climate}</td>
                      <td className="p-4 text-center hidden md:table-cell font-medium text-gray-600">{school.score_teachers}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty state & Loading */}
            {schools.length === 0 && !loading && (
              <div className="p-12 text-center text-gray-500">
                Inga skolor matchade din sökning.
              </div>
            )}

            <div ref={observerTarget} className="p-8 flex justify-center items-center w-full">
               {loading && <Loader2 className="w-8 h-8 animate-spin text-blue-500" />}
               {!loading && !hasMore && schools.length > 0 && (
                 <span className="text-gray-400 text-sm">Du har nått slutet av listan</span>
               )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}