import { Metadata } from "next";
import { Database, Scale, FileText, Info, FlaskConical, Sparkles, AlertTriangle, CalendarRange } from "lucide-react";

export const metadata: Metadata = {
  title: "Vår Metod | Skolrank",
  description: "Hur vi räknar. Ett öppet hobbyprojekt baserat på offentlig data.",
};

export default function MethodPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-black font-sans pb-24">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          {/* Hobby-badgen borttagen härifrån */}
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Ingen ranking är perfekt.
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Men vi tror att data är bättre än rykten. Vi samlar statistik från Skolverket och Skolinspektionen och väger samman det till ett index. Här är vårt recept.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        
        {/* Intro */}
        <div className="prose prose-lg text-gray-600 mb-12 mx-auto">
          <p>
            Rankningen på den här sidan är inte "sanningen" med stort S. Det är en sammanvägning av offentlig statistik som vi tycker ger en rättvis bild av skolans profil.
            Vi premierar skolor som levererar bra resultat, men vi har också byggt in spärrar för att motverka betygsinflation.
          </p>
        </div>

        {/* --- DATATABELLEN --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-16">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-gray-900">Ingredienserna i vår ranking</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                        <tr>
                            <th className="p-4 w-1/5">Kategori & Vikt</th>
                            <th className="p-4 w-1/3">Vad mäter vi? (Intern viktning)</th>
                            <th className="p-4 w-1/6">Källa</th>
                            <th className="p-4">Varför?</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        
                        {/* AKADEMISKA */}
                        <tr className="bg-blue-50/30">
                            <td className="p-4 font-bold text-blue-900 align-top" rowSpan={2}>
                                Resultat <br/>
                                <span className="text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">55% av totalen</span>
                            </td>
                            <td className="p-4 align-top">
                                <div className="font-bold text-gray-900 mb-1">Betygssnitt</div>
                                <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Vikt: 33%</span>
                            </td>
                            <td className="p-4 text-gray-500 align-top">Skolverket</td>
                            <td className="p-4 text-gray-600 align-top">
                                Det klassiska måttet. Elevernas genomsnittliga meritvärde.
                            </td>
                        </tr>
                        <tr className="bg-blue-50/30">
                            <td className="p-4 align-top">
                                <div className="font-bold text-gray-900 mb-1">Nationella Prov (NP)</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded" title="Matte väger tyngst för att det är minst subjektivt">Matte: 33%</span>
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-medium px-1.5 py-0.5 rounded">Svenska: 17%</span>
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-medium px-1.5 py-0.5 rounded">Engelska: 17%</span>
                                </div>
                            </td>
                            <td className="p-4 text-gray-500 align-top">Skolverket</td>
                            <td className="p-4 text-gray-600 align-top">
                                Vi jämför NP-resultat i kärnämnen med betygen. Matte väger tyngst då det anses vara det mest "objektiva" ämnet vid rättning.
                            </td>
                        </tr>

                        {/* SOCIO */}
                        <tr className="bg-pink-50/30">
                            <td className="p-4 font-bold text-pink-900 align-top" rowSpan={2}>
                                Profil <br/>
                                <span className="text-xs font-normal text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">20% av totalen</span>
                            </td>
                            <td className="p-4 align-top">
                                <div className="font-bold text-gray-900 mb-1">Föräldrars utbildning</div>
                                <span className="inline-block bg-pink-100 text-pink-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Vikt: 70%</span>
                            </td>
                            <td className="p-4 text-gray-500 align-top">Skolverket</td>
                            <td className="p-4 text-gray-600 align-top">
                                Andel föräldrar med eftergymnasial utbildning. Den absolut tyngsta faktorn för studieresultat enligt forskning.
                            </td>
                        </tr>
                        <tr className="bg-pink-50/30">
                            <td className="p-4 align-top">
                                <div className="font-bold text-gray-900 mb-1">Utländsk bakgrund</div>
                                <span className="inline-block bg-pink-50 text-pink-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Vikt: 30%</span>
                            </td>
                            <td className="p-4 text-gray-500 align-top">Skolverket</td>
                            <td className="p-4 text-gray-600 align-top">
                                Andel elever med utländsk bakgrund (viktas omvänt). En indikation på språkliga utmaningar i klassrummet.
                            </td>
                        </tr>

                        {/* KLIMAT */}
                        <tr className="bg-emerald-50/30">
                            <td className="p-4 font-bold text-emerald-900 align-top" rowSpan={2}>
                                Klimat <br/>
                                <span className="text-xs font-normal text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">15% av totalen</span>
                            </td>
                            <td className="p-4 align-top">
                                <div className="font-bold text-gray-900 mb-1">Trygghet & Studiero</div>
                                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Vikt: 80%</span>
                            </td>
                            <td className="p-4 text-gray-500 align-top">Skolinspektionen</td>
                            <td className="p-4 text-gray-600 align-top">
                                Elevernas egna upplevelse av trygghet och arbetsro på lektionerna. Väger mycket tungt i denna kategori.
                            </td>
                        </tr>
                         <tr className="bg-emerald-50/30">
                            <td className="p-4 align-top">
                                <div className="font-bold text-gray-900 mb-1">Utmaningar</div>
                                <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Vikt: 20%</span>
                            </td>
                            <td className="p-4 text-gray-500 align-top">Skolinspektionen</td>
                            <td className="p-4 text-gray-600 align-top">
                                Om eleverna upplever att skolan ställer krav, har höga förväntningar och utmanar dem i lärandet.
                            </td>
                        </tr>

                        {/* LÄRARE */}
                        <tr className="bg-violet-50/30">
                            <td className="p-4 font-bold text-violet-900 align-top" rowSpan={2}>
                                Resurser <br/>
                                <span className="text-xs font-normal text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">10% av totalen</span>
                            </td>
                            <td className="p-4 align-top">
                                <div className="font-bold text-gray-900 mb-1">Behörighet & Täthet</div>
                                <div className="flex gap-2 mt-1">
                                    <span className="bg-violet-100 text-violet-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Behörighet: 50%</span>
                                    <span className="bg-violet-50 text-violet-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Täthet: 30%</span>
                                </div>
                            </td>
                            <td className="p-4 text-gray-500 align-top">Skolverket</td>
                            <td className="p-4 text-gray-600 align-top">Har lärarna legitimation? Hur många elever går det på varje lärare?</td>
                        </tr>
                         <tr className="bg-violet-50/30">
                            <td className="p-4 align-top">
                                <div className="font-bold text-gray-900 mb-1">Karriärtjänster</div>
                                <span className="inline-block bg-violet-50 text-violet-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Vikt: 20%</span>
                            </td>
                            <td className="p-4 text-gray-500 align-top">Skolverket</td>
                            <td className="p-4 text-gray-600 align-top">Andel förstelärare. En indikation på lärarkårens kompetensnivå och skolans attraktionskraft som arbetsgivare.</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

        {/* --- DETALJER & FÖRTYDLIGANDEN --- */}

        {/* 1. STRAFFET */}
        <div className="bg-red-50 rounded-2xl p-8 border border-red-100 mb-12">
            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Så straffar vi glädjebetyg
            </h3>
            <div className="prose prose-sm text-red-800 max-w-none">
                <p>
                    Ett stort problem i svensk skola är betygsinflation – att skolor sätter högre betyg än vad eleverna presterar på de nationella proven (NP). För att rankningen ska vara rättvis har vi infört en automatisk spärr.
                </p>
                <div className="bg-white p-6 rounded-xl border border-red-100 mt-4 shadow-sm">
                    <h4 className="text-gray-900 font-bold mb-2">Regeln för poängavdrag:</h4>
                    <p className="mb-4">
                        Vi jämför skolans genomsnittliga betyg med resultatet på NP i Matematik, Svenska och Engelska.
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>
                            Ett "halvt betygssteg" motsvarar <strong>2.5 poäng</strong> (t.ex. skillnaden mellan 12.5 och 15.0).
                        </li>
                        <li>
                            Om gapet mellan betyg och NP är <strong>större än 2.5 poäng</strong> i något av kärnämnena, anser vi att avvikelsen är onormalt stor.
                        </li>
                    </ul>
                    <p className="font-medium">
                        <strong>Konsekvens:</strong> Skolan får ett avdrag på <strong>15%</strong> av poängen i kategorin Akademiska Resultat. Detta sänker skolans totala rankingpoäng avsevärt.
                    </p>
                </div>
            </div>
        </div>

        {/* 2. TREÅRSSNITT */}
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mb-16">
             <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <CalendarRange className="w-6 h-6 text-blue-600" />
                Vi använder ett 3-års-snitt
            </h3>
            <p className="text-blue-800 leading-relaxed">
                Skolresultat kan variera från år till år beroende på vilken kull elever som går ut. En "dålig" årskull ska inte sänka en hel skolas rykte, och en enstaka topp-prestation ska inte överskattas.
            </p>
            <p className="text-blue-800 mt-2 font-medium">
                Därför baseras all statistik (betyg, NP och lärardata) på ett <strong>glidande medelvärde av de tre senaste läsåren</strong>. Det ger en mycket mer stabil och rättvisande bild av skolans kvalitet över tid.
            </p>
        </div>


        {/* DETALJER & LOGIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* ENKÄTEN */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Vad frågade vi eleverna?
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Siffrorna för studieklimat kommer direkt från eleverna (åk 5 och 9) som svarat på Skolinspektionens enkät. Några av frågorna är:
                </p>

                <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 italic">
                            <li>"Känner du dig trygg i skolan?"</li>
                            <li>"Är du rädd för andra elever på skolan?"</li>
                            <li>"Finns det någon vuxen du kan prata med?"</li>
                            <li>"Är det arbetsro på lektionerna?"</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* SOCIO */}
            <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-pink-600" />
                    Varför mäts bakgrund?
                </h3>
                <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100 h-full">
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed font-medium">
                        Är det inte orättvist att väga in föräldrarnas jobb?
                    </p>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        Jo, man kan tycka det. Men faktum är att studiemiljön påverkas av vilka som går på skolan. 
                        Statistik visar tydliga samband mellan föräldrars utbildningsnivå och studieresultat.
                    </p>
                    <p className="text-gray-600 text-sm mb-0 leading-relaxed">
                        Vi har med dessa parametrar för att beskriva <strong>förutsättningarna</strong> och miljön. Det ger en fingervisning om tempot i klassrummet och vilken typ av utmaningar skolan hanterar i vardagen. 
                        Det är ren statistik, inget annat.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}