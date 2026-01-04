export type RankedSchool = {
  school_unit_code: string;
  name: string;
  municipality_name: string;
  organizer_name: string | null;
  organizer_type: string | null;
  info_eligible: number | null;

  // Ranking
  rank: number | null; 

  // Poäng
  total_score: number | null;
  raw_score_academic: number | null;
  score_academic: number | null;
  score_socio: number | null;
  score_climate: number | null;
  score_teachers: number | null;

  // STRAFF & AVDRAG (Nytt!)
  gap_diff?: number | null;                 // Skillnaden (Betyg - NP)
  has_inflation_penalty?: boolean | null;   // True om gap > 2.5
  inflation_deduction_points?: number | null; // Poängen som drogs av

  // Rådata
  val_merit: number | null;
  val_avg_grade: number | null;
  
  grade_ma: number | null;
  grade_swe: number | null;
  grade_eng: number | null;
  
  np_ma: number | null;
  np_swe: number | null;
  np_eng: number | null;

  val_parents_edu: number | null;
  val_foreign_bg: number | null;
  val_safety: number | null;
  val_studiero: number | null;
  val_challenge: number | null;
  val_teacher_cert_perc: number | null;
  val_students_per_teacher: number | null;
  val_first_teacher_perc: number | null; 

  // Rikssnitt
  avg_merit: number | null;
  avg_avg_grade: number | null;
  avg_np_ma: number | null;
  avg_np_swe: number | null;
  avg_np_eng: number | null;
  avg_parents_edu: number | null;
  avg_foreign_bg: number | null;
  avg_safety: number | null;
  avg_studiero: number | null;
  avg_challenge: number | null;
  avg_cert: number | null;
  avg_dens: number | null;
  avg_first_teacher_perc: number | null;

  // Gaps (Individuella ämnen)
  gap_ma: number | null;
  gap_swe: number | null;
  gap_eng: number | null;
};

export type RankedOrganizer = {
  organizer_name: string;
  organizer_type: string;
  school_count: number;
  rank: number;
  
  // Medelvärden
  avg_total_score: number;
  avg_academic: number;
  avg_socio: number;
  avg_climate: number;
  avg_teachers: number;
};