"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, GraduationCap, ShieldCheck, Users, TrendingUp, AlertTriangle, Building2, Trophy, Backpack, Info, ExternalLink } from "lucide-react";
import { RankedSchool } from "@/types/database";

// --- HJÄLPFUNKTION: Konvertera poäng till närmaste betyg ---
function getLetterGrade(score: number | null): string {
  if (score === null || score === undefined) return "-";
  
  if (score >= 18.75) return "A";
  if (score >= 16.25) return "B";
  if (score >= 13.75) return "C";
  if (score >= 11.25) return "D";
  if (score >= 10.00) return "E";
  return "F";
}

// --- KOMPONENT: MetricBar ---
const MetricBar = ({ 
  label, 
  value, 
  max, 
  average, 
  unit = "", 
  colorClass = "bg-blue-600", 
  inverse = false,
  showGradeLetter = false
}: { 
  label: string, 
  value: number | null, 
  max: number, 
  average?: number | null, 
  unit?: string, 
  colorClass?: string, 
  inverse?: boolean,
  showGradeLetter?: boolean
}) => {
  const numValue = Number(value) || 0;
  const numAvg = Number(average) || 0;
  const hasAverage = average !== null && average !== undefined;
  
  const safeMax = max === 0 ? 1 : max;

  let percent = Math.min(100, Math.max(0, (numValue / safeMax) * 100));
  let avgPercent = hasAverage ? Math.min(100, Math.max(0, (numAvg / safeMax) * 100)) : null;

  if (inverse) {
    percent = 100 - percent;
    if (avgPercent !== null) {
      avgPercent = 100 - avgPercent;
    }
  }

  const gradeLetter = showGradeLetter ? getLetterGrade(numValue) : "";
  const avgGradeLetter = showGradeLetter && hasAverage ? getLetterGrade(numAvg) : "";

  return (
    <div className="mb-5 w-full">
      <div className="flex justify-between text-sm mb-1 px-0.5">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="font-bold text-gray-900">
            {value !== null ? numValue.toFixed(1) : "-"}{unit}
            {showGradeLetter && value !== null && (
                <span className="ml-1.5 text-gray-500 font-normal">({gradeLetter})</span>
            )}
        </span>
      </div>

      <div className="relative w-full h-5 flex items-center">
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
           <div 
             className={`h-full transition-all duration-1000 ease-out ${colorClass}`} 
             style={{ width: `${percent}%` }} 
           />
        </div>
        
        {avgPercent !== null && (
          <div 
            className="absolute top-0 w-[2px] h-full bg-gray-900 z-10 ring-2 ring-white rounded-sm" 
            style={{ left: `${avgPercent}%` }}
            title={`Rikssnitt: ${numAvg.toFixed(1)}${unit}`}
          />
        )}
      </div>
      
      {hasAverage && (
        <div className="text-[10px] text-gray-400 text-right -mt-1 font-medium px-0.5">
          Rikssnitt: <span className="text-gray-600">{numAvg.toFixed(1)}{unit}</span>
          {showGradeLetter && (
              <span className="ml-1 text-gray-500">({avgGradeLetter})</span>
          )}
        </div>
      )}
    </div>
  );
};

// --- KOMPONENT: CategoryBox ---
// Uppdaterad för att hantera inflationPenalty och visualisera straffet
const CategoryBox = ({ title, weight, score, icon: Icon, color, children, warning, inflationPenalty }: any) => {
  const safeScore = !isNaN(Number(score)) ? Math.round(Number(score)) : 0;
  
  // Om straff finns, räkna ut vad poängen var INNAN (för att visa pedagogiskt)
  const originalScore = inflationPenalty ? safeScore + inflationPenalty : safeScore;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col relative overflow-hidden">
      
      {/* Röd hörn-flash om straff finns */}
      {inflationPenalty > 0 && (
         <div className="absolute top-0 right-0 p-2 bg-red-100 rounded-bl-2xl border-b border-l border-red-200 z-10">
            <div className="flex items-center gap-1 text-xs font-bold text-red-700">
                <AlertTriangle className="w-3 h-3" />
                <span>-15%</span>
            </div>
         </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-700`}>
            <Icon className={`w-6 h-6 text-${color.split('-')[1]}-700`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
            <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              Vikt: {weight}%
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex flex-col items-end">
             {/* Visa överstruken gammal poäng om straff finns */}
            {inflationPenalty > 0 ? (
                <>
                    <span className="text-sm text-gray-400 line-through decoration-red-400 decoration-2 opacity-60">
                      {originalScore}
                    </span>
                    <span className="text-3xl font-black text-red-600">
                      {safeScore}
                    </span>
                </>
            ) : (
                <div className="text-3xl font-black text-gray-900">{safeScore}</div>
            )}
          </div>
          <div className="text-xs text-gray-400 font-medium uppercase">Poäng</div>
        </div>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
        <div className={`h-full ${color.replace('text', 'bg').replace('bg-opacity-10', '')}`} style={{ width: `${safeScore}%` }} />
      </div>

      {/* RÖD VARNINGSRUTA FÖR INFLATION */}
      {inflationPenalty > 0 && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3 items-start animate-in fade-in slide-in-from-top-1">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs text-red-800">
            <span className="font-bold block mb-1">Avdrag för betygsinflation</span>
            Skolans betyg är betydligt högre än resultaten på Nationella Proven (diff: {warning}). 
            Därför har <strong>{inflationPenalty} poäng</strong> dragits av från resultatet.
          </div>
        </div>
      )}

      {/* VANLIG VARNING (Fallback) */}
      {!inflationPenalty && warning && typeof warning === 'string' && (
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-800">
            {warning}
          </div>
        </div>
      )}

      <div className="mt-auto space-y-1">
        {children}
      </div>
    </div>
  );
};

// --- CLIENT COMPONENT ---
export default function SchoolProfileClient({ school9, school6 }: { school9: RankedSchool | null, school6: RankedSchool | null }) {
  
  const [activeTab, setActiveTab] = useState<'9' | '6'>(school9 ? '9' : '6');
  const school = activeTab === '9' ? school9 : school6;

  if (!school) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Data saknas för denna nivå</h2>
                <button onClick={() => setActiveTab(activeTab === '9' ? '6' : '9')} className="text-blue-600 underline">
                    Visa {activeTab === '9' ? 'Mellanstadiet' : 'Högstadiet'} istället
                </button>
            </div>
        </div>
    );
  }

  // OBS: Vi använder nu data direkt från backend istället för att räkna själva
  // (school.has_inflation_penalty och school.inflation_deduction_points)
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24 text-black font-sans">
      
      {/* Header Sektion */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          <Link href="/topplistan" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Tillbaka till listan
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="w-full md:w-auto">
              <div className="flex flex-wrap gap-2 mb-3">
                 <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {school.organizer_type || "Skola"}
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 border border-gray-200">
                  <MapPin className="w-3 h-3" /> {school.municipality_name}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-2">
                {school.name}
              </h1>
              <p className="text-gray-500 mb-4">Enhet: {school.school_unit_code}</p>

              {/* TAB SWITCHER */}
              {(school9 && school6) ? (
                  <div className="flex p-1 bg-gray-100 rounded-lg w-fit mt-4 border border-gray-200">
                      <button 
                        onClick={() => setActiveTab('9')}
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === '9' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <GraduationCap className="w-4 h-4" /> Högstadiet
                      </button>
                      <button 
                        onClick={() => setActiveTab('6')}
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === '6' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <Backpack className="w-4 h-4" /> Mellanstadiet
                      </button>
                  </div>
              ) : (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-semibold border border-gray-200">
                    {school9 ? <GraduationCap className="w-4 h-4"/> : <Backpack className="w-4 h-4"/>}
                    {school9 ? "Endast Högstadiet" : "Endast Mellanstadiet"}
                </div>
              )}

            </div>

            {/* SCORE CARD */}
            <div className={`flex flex-row text-white rounded-2xl shadow-xl overflow-hidden transform md:-translate-y-2 shrink-0 transition-colors duration-300 ${activeTab === '9' ? 'bg-gray-900' : 'bg-indigo-700'}`}>
              <div className={`p-6 flex flex-col items-center justify-center border-r min-w-[150px] ${activeTab === '9' ? 'bg-gray-800 border-gray-700' : 'bg-indigo-600 border-indigo-500'}`}>
                <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Ranking</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-medium text-white/60">#</span>
                    <span className="text-5xl font-black tracking-tighter text-white">{school.rank || "-"}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center min-w-[150px]">
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest mb-2">Totalpoäng</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter text-white">{school.total_score || 0}</span>
                    <span className="text-sm font-bold text-white/60">/ 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid med Kategorier */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* AKADEMISKA */}
          <CategoryBox 
            title="Akademiska Resultat" 
            weight={55} 
            score={school.score_academic} 
            icon={GraduationCap} 
            color="bg-blue-600"
            
            // HÄR SKICKAR VI MED STRAFF-DATAN
            inflationPenalty={school.has_inflation_penalty ? school.inflation_deduction_points : 0}
            warning={school.has_inflation_penalty ? `${school.gap_diff?.toFixed(2)} enheter` : null}
          >
            <MetricBar label="Genomsnittlig Betygspoäng" value={school.val_avg_grade} max={20} average={school.avg_avg_grade} unit=" p" colorClass="bg-blue-600" showGradeLetter={true} />
            <MetricBar label="NP Matematik" value={school.np_ma} max={20} average={school.avg_np_ma} unit="" colorClass="bg-blue-600" showGradeLetter={true} />
            <MetricBar label="NP Svenska" value={school.np_swe} max={20} average={school.avg_np_swe} unit="" colorClass="bg-blue-600" showGradeLetter={true} />
            <MetricBar label="NP Engelska" value={school.np_eng} max={20} average={school.avg_np_eng} unit="" colorClass="bg-blue-600" showGradeLetter={true} />
            
            {activeTab === '9' && (
                <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-400">
                Meritvärde (Visas ej i ranking): <span className="text-gray-700 font-bold">{school.val_merit?.toFixed(1) || "-"} p</span>
                </div>
            )}
          </CategoryBox>

          {/* SOCIOEKONOMI */}
          <CategoryBox title="Socioekonomisk Profil" weight={20} score={school.score_socio} icon={TrendingUp} color="bg-pink-600">
            <MetricBar label="Föräldrar m. eftergymn. utb." value={school.val_parents_edu} max={100} average={school.avg_parents_edu} unit="%" colorClass="bg-pink-600" />
            <MetricBar label="Utländsk bakgrund" value={school.val_foreign_bg} max={100} average={school.avg_foreign_bg} unit="%" colorClass="bg-pink-600" />
            
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 leading-relaxed">
                <div className="flex items-center gap-2 mb-2 font-bold text-gray-800">
                    <Info className="w-4 h-4 text-blue-500" />
                    Bakgrund till måtten
                </div>
                <p className="mb-2">
                    Statistik från SCB visar att det finns tydliga samband mellan elevers socioekonomiska bakgrund och deras studieresultat. 
                    Framför allt har föräldrarnas utbildningsnivå visat sig ha stor betydelse för elevers meritvärden i grundskolan.
                </p>
                <a 
                    href="https://www.scb.se/hitta-statistik/artiklar/2021/socioekonomiska-faktorer-kan-paverka-hogstadieelevers-meritvarde/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline font-medium"
                >
                    Läs mer hos SCB <ExternalLink className="w-3 h-3 ml-1" />
                </a>
            </div>

          </CategoryBox>

          {/* KLIMAT */}
          <CategoryBox title="Studieklimat" weight={15} score={school.score_climate} icon={ShieldCheck} color="bg-emerald-600">
            <div className="text-xs text-gray-400 mb-3 ml-0.5">
                Källa: Skolinspektionens Enkät ({activeTab === '9' ? "Åk 8" : "Åk 5"})
            </div>
            <MetricBar label="Trygghet" value={school.val_safety} max={10} average={school.avg_safety} unit="/10" colorClass="bg-emerald-600" />
            <MetricBar label="Studiero" value={school.val_studiero} max={10} average={school.avg_studiero} unit="/10" colorClass="bg-emerald-600" />
            <MetricBar label="Utmaningar" value={school.val_challenge} max={10} average={school.avg_challenge} unit="/10" colorClass="bg-emerald-600" />
          </CategoryBox>

          {/* LÄRARE */}
          <CategoryBox title="Lärarkår" weight={10} score={school.score_teachers} icon={Users} color="bg-violet-600">
            <MetricBar label="Lärarbehörighet" value={school.val_teacher_cert_perc} max={100} average={school.avg_cert} unit="%" colorClass="bg-violet-600" />
            <MetricBar label="Elever per lärare" value={school.val_students_per_teacher} max={25} average={school.avg_dens} unit=" st" colorClass="bg-violet-600" inverse={true} />
            <MetricBar label="Andel förstelärare" value={school.val_first_teacher_perc} max={50} average={school.avg_first_teacher_perc} unit="%" colorClass="bg-violet-600" />
          </CategoryBox>
          
        </div>
      </div>
    </div>
  );
}