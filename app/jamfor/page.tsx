"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { RankedSchool } from "@/types/database";
import { Search, X, Plus, GraduationCap, Backpack, Trophy, MapPin, Building2, Loader2, TrendingUp, ShieldCheck, Users } from "lucide-react";

// --- KOMPONENT: Sök Dropdown ---
const SchoolSearch = ({ level, onSelect }: { level: '9' | '6', onSelect: (s: RankedSchool) => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RankedSchool[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const searchSchools = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const table = level === '9' ? 'final_rankings_9' : 'final_rankings_6';
      
      const { data } = await supabase
        .from(table)
        .select("*")
        .ilike('name', `%${query}%`)
        .limit(5);

      if (data) setResults(data);
      setLoading(false);
    };

    const timer = setTimeout(searchSchools, 300);
    return () => clearTimeout(timer);
  }, [query, level]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Lägg till skola..."
          className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && <Loader2 className="absolute right-3 top-3.5 w-5 h-5 animate-spin text-blue-500" />}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {results.map((school) => (
            <button
              key={school.school_unit_code}
              onClick={() => {
                onSelect(school);
                setQuery("");
                setResults([]);
                setIsOpen(false);
              }}
              className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex justify-between items-center group"
            >
              <div>
                <div className="font-bold text-gray-900 group-hover:text-blue-600">{school.name}</div>
                <div className="text-xs text-gray-500">{school.municipality_name}</div>
              </div>
              <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- KOMPONENT: Jämförelse Rad ---
const CompareRow = ({ label, schools, valueKey, format = (v: any) => v, highlightMax = false, inverse = false }: any) => {
  // Hitta bästa värdet för highlight
  const values = schools.map((s: any) => Number(s[valueKey]) || 0);
  const bestValue = inverse ? Math.min(...values.filter((v: number) => v > 0)) : Math.max(...values);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="p-4 text-sm font-medium text-gray-500 w-1/4 align-middle">{label}</td>
      {schools.map((school: any) => {
        const val = Number(school[valueKey]) || 0;
        const isBest = highlightMax && val === bestValue && val > 0;
        
        return (
          <td key={school.school_unit_code} className={`p-4 text-center w-1/4 ${isBest ? "bg-green-50/20" : ""}`}>
            <span className={`font-bold ${isBest ? "text-green-700" : "text-gray-900"}`}>
              {school[valueKey] !== null ? format(school[valueKey]) : "-"}
            </span>
          </td>
        );
      })}
      {/* Fyll ut tomma celler */}
      {[...Array(3 - schools.length)].map((_, i) => <td key={i} className="w-1/4"></td>)}
    </tr>
  );
};

// --- NY UPPDATERAD HEADER SOM VISAR POÄNG ---
const SectionHeader = ({ title, color, icon: Icon, schools, scoreKey }: any) => {
    // Hitta bästa poäng för highlight
    const values = schools.map((s: any) => Number(s[scoreKey]) || 0);
    const bestValue = Math.max(...values);

    return (
        <tr className={`${color} bg-opacity-20 border-t-2 border-white`}>
            {/* Titel Kolumn */}
            <td className="p-4 w-1/4">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-white bg-opacity-60`}>
                        <Icon className={`w-4 h-4 text-gray-900`} />
                    </div>
                    <span className="font-bold text-gray-900 uppercase tracking-wide text-xs">{title}</span>
                </div>
            </td>

            {/* Skolornas Poäng Kolumner */}
            {schools.map((school: any) => {
                const val = Number(school[scoreKey]) || 0;
                const isBest = val === bestValue && val > 0;
                
                return (
                    <td key={school.school_unit_code} className={`p-4 text-center w-1/4 relative ${isBest ? "bg-white/40 shadow-sm font-black" : ""}`}>
                         <div className="flex flex-col items-center justify-center">
                            <span className={`text-xl ${isBest ? "text-gray-900 scale-110" : "text-gray-600 font-bold"}`}>
                                {val}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase font-semibold">Poäng</span>
                         </div>
                    </td>
                )
            })}
            
            {/* Tomma celler */}
            {[...Array(3 - schools.length)].map((_, i) => <td key={i} className="w-1/4"></td>)}
        </tr>
    );
};


export default function ComparePage() {
  const [level, setLevel] = useState<'9' | '6'>('9');
  const [selectedSchools, setSelectedSchools] = useState<RankedSchool[]>([]);

  // Byt nivå -> Rensa listan
  const handleLevelChange = (newLevel: '9' | '6') => {
    if (newLevel !== level) {
      setLevel(newLevel);
      setSelectedSchools([]);
    }
  };

  const addSchool = (school: RankedSchool) => {
    if (selectedSchools.some(s => s.school_unit_code === school.school_unit_code)) return;
    if (selectedSchools.length >= 3) return;
    setSelectedSchools([...selectedSchools, school]);
  };

  const removeSchool = (code: string) => {
    setSelectedSchools(selectedSchools.filter(s => s.school_unit_code !== code));
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 text-black font-sans pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Jämför Skolor ⚖️</h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Ställ upp till 3 skolor sida vid sida för att se exakt hur de skiljer sig i betyg, trygghet och lärarresurser.
          </p>

          {/* Nivå-väljare */}
          <div className="inline-flex p-1 bg-gray-200 rounded-xl shadow-inner mb-8">
            <button
              onClick={() => handleLevelChange('9')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${level === '9' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <GraduationCap className="w-4 h-4" /> Högstadiet
            </button>
            <button
              onClick={() => handleLevelChange('6')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${level === '6' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Backpack className="w-4 h-4" /> Mellanstadiet
            </button>
          </div>

          {/* Sökfält (Visas bara om man har plats kvar) */}
          {selectedSchools.length < 3 && (
            <div className="flex justify-center mb-12">
                <SchoolSearch level={level} onSelect={addSchool} />
            </div>
          )}
          
          {selectedSchools.length === 3 && (
              <div className="mb-12 p-3 bg-blue-50 text-blue-800 text-sm font-medium inline-block rounded-lg border border-blue-100">
                  Du jämför max antal skolor (3). Ta bort en för att lägga till ny.
              </div>
          )}
        </div>

        {/* --- JÄMFÖRELSE MATRIS --- */}
        {selectedSchools.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 w-1/4 bg-gray-50 border-b border-gray-200"></th>
                    {selectedSchools.map(school => (
                      <th key={school.school_unit_code} className="p-4 w-1/4 border-b border-gray-200 align-top relative bg-white">
                        <button 
                            onClick={() => removeSchool(school.school_unit_code)}
                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <Link href={`/skola/${school.school_unit_code}`} className="block hover:underline group">
                            <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{school.name}</h3>
                        </Link>
                        <div className="text-xs text-gray-500 mb-2">{school.municipality_name}</div>
                        
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white ${level === '9' ? 'bg-gray-900' : 'bg-indigo-600'}`}>
                            <Trophy className="w-3 h-3 text-yellow-400" />
                            Rank #{school.rank}
                        </div>
                      </th>
                    ))}
                    {/* Tomma headers */}
                    {[...Array(3 - selectedSchools.length)].map((_, i) => (
                        <th key={i} className="p-4 w-1/4 border-b border-gray-200 bg-gray-50/30 text-center text-gray-400 font-normal text-sm italic">
                            Tom plats
                        </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  
                  {/* TOTALPOÄNG */}
                  <tr className="bg-gray-50">
                    <td className="p-4 font-bold text-gray-900 align-middle">Totalpoäng</td>
                    {selectedSchools.map(s => (
                        <td key={s.school_unit_code} className="p-4 text-center align-middle">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-lg">
                                <span className="text-2xl font-black">{s.total_score}</span>
                            </div>
                        </td>
                    ))}
                    {[...Array(3 - selectedSchools.length)].map((_, i) => <td key={i}></td>)}
                  </tr>

                  {/* AKADEMISKA */}
                  <SectionHeader title="Akademiska Resultat" color="bg-blue-100" icon={GraduationCap} schools={selectedSchools} scoreKey="score_academic" />
                  <CompareRow label="Snittbetyg" schools={selectedSchools} valueKey="val_avg_grade" format={(v: number) => v.toFixed(1)} highlightMax={true} />
                  <CompareRow label="NP Matte" schools={selectedSchools} valueKey="np_ma" format={(v: number) => v.toFixed(1)} highlightMax={true} />
                  <CompareRow label="NP Svenska" schools={selectedSchools} valueKey="np_swe" format={(v: number) => v.toFixed(1)} highlightMax={true} />
                  <CompareRow label="NP Engelska" schools={selectedSchools} valueKey="np_eng" format={(v: number) => v.toFixed(1)} highlightMax={true} />

                  {/* SOCIO */}
                  <SectionHeader title="Socioekonomi" color="bg-pink-100" icon={TrendingUp} schools={selectedSchools} scoreKey="score_socio" />
                  <CompareRow label="Högutbildade föräldrar" schools={selectedSchools} valueKey="val_parents_edu" format={(v: number) => v.toFixed(0) + "%"} />
                  <CompareRow label="Utländsk bakgrund" schools={selectedSchools} valueKey="val_foreign_bg" format={(v: number) => v.toFixed(0) + "%"} />

                  {/* KLIMAT */}
                  <SectionHeader title="Studieklimat" color="bg-emerald-100" icon={ShieldCheck} schools={selectedSchools} scoreKey="score_climate" />
                  <CompareRow label="Trygghet" schools={selectedSchools} valueKey="val_safety" format={(v: number) => v.toFixed(1)} highlightMax={true} />
                  <CompareRow label="Studiero" schools={selectedSchools} valueKey="val_studiero" format={(v: number) => v.toFixed(1)} highlightMax={true} />

                  {/* LÄRARE */}
                  <SectionHeader title="Lärarkår" color="bg-violet-100" icon={Users} schools={selectedSchools} scoreKey="score_teachers" />
                  <CompareRow label="Behörighet" schools={selectedSchools} valueKey="val_teacher_cert_perc" format={(v: number) => v.toFixed(0) + "%"} highlightMax={true} />
                  <CompareRow label="Elever / Lärare" schools={selectedSchools} valueKey="val_students_per_teacher" format={(v: number) => v.toFixed(1)} highlightMax={true} inverse={true} />
                  <CompareRow label="Förstelärare" schools={selectedSchools} valueKey="val_first_teacher_perc" format={(v: number) => v.toFixed(0) + "%"} highlightMax={true} />

                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
            <div className="bg-blue-50 p-4 rounded-full inline-flex mb-4">
                <Search className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Inga skolor valda än</h3>
            <p className="text-gray-500 mb-6">Sök efter skolor ovan för att börja jämföra.</p>
          </div>
        )}

      </div>
    </main>
  );
}